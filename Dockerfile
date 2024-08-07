# base
# ------------------------------------------------
FROM node:20-bookworm-slim as base

RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarn/plugins .yarn/plugins
COPY --chown=node:node .yarn/releases .yarn/releases
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node api/package.json api/
COPY --chown=node:node web/package.json web/
COPY --chown=node:node yarn.lock .

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn install

COPY --chown=node:node redwood.toml .
COPY --chown=node:node graphql.config.js .
COPY --chown=node:node .env.defaults .env.defaults

# api build
# ------------------------------------------------
FROM base as api_build

# If your api side build relies on build-time environment variables,
# specify them here as ARGs. (But don't put secrets in your Dockerfile!)
#
# ARG MY_BUILD_TIME_ENV_VAR

COPY --chown=node:node api api
RUN yarn redwood build api

# web prerender build
# ------------------------------------------------
FROM api_build as web_build_with_prerender

COPY --chown=node:node web web
RUN yarn redwood build web

# web build
# ------------------------------------------------
FROM base as web_build

COPY --chown=node:node web web
RUN yarn redwood build web --no-prerender

# serve api
# ------------------------------------------------
FROM node:18-bookworm-slim as api_serve

RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarn/plugins .yarn/plugins
COPY --chown=node:node .yarn/releases .yarn/releases
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node api/package.json .
COPY --chown=node:node yarn.lock .

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn workspaces focus api --production

COPY --chown=node:node redwood.toml .
COPY --chown=node:node graphql.config.js .
COPY --chown=node:node .env.defaults .env.defaults

COPY --chown=node:node --from=api_build /home/node/app/api/dist /home/node/app/api/dist
COPY --chown=node:node --from=api_build /home/node/app/api/db /home/node/app/api/db
COPY --chown=node:node --from=api_build /home/node/app/node_modules/.prisma /home/node/app/node_modules/.prisma

ENV NODE_ENV=production

CMD [ "node_modules/.bin/rw-server", "api", "--load-env-files" ]

# serve web
# ------------------------------------------------
FROM node:20-bookworm-slim as web_serve

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarn/plugins .yarn/plugins
COPY --chown=node:node .yarn/releases .yarn/releases
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node web/package.json .
COPY --chown=node:node yarn.lock .

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn workspaces focus web --production

COPY --chown=node:node redwood.toml .
COPY --chown=node:node graphql.config.js .
COPY --chown=node:node .env.defaults .env.defaults

COPY --chown=node:node --from=web_build /home/node/app/web/dist /home/node/app/web/dist

ENV NODE_ENV=production \
    API_HOST=http://api:8911

# We use the shell form here for variable expansion.
CMD "node_modules/.bin/rw-web-server" "--apiHost" "$API_HOST"

# console
# ------------------------------------------------
FROM base as console

# To add more packages:
#
# ```
# USER root
#
# RUN apt-get update && apt-get install -y \
#     curl
#
# USER node
# ```
USER root

RUN DEBIAN_FRONTEND="noninteractive" apt update && apt install -y \
    curl gnupg gnupg2 gnupg1 groff postgresql-client-15 unzip

# Install awscli
RUN mkdir -p /tmp/awscli
COPY aws-public-key.gpg /tmp/awscli/key.gpg
RUN gpg --import /tmp/awscli/key.gpg
RUN sh -c 'curl -o "/tmp/awscli/awscliv2.sig" https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip.sig'
RUN sh -c 'curl -o "/tmp/awscli/awscliv2.zip" "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip"'
RUN gpg --verify /tmp/awscli/awscliv2.sig /tmp/awscli/awscliv2.zip
RUN unzip -u -d /tmp/awscli/ /tmp/awscli/awscliv2.zip
RUN /tmp/awscli/aws/install
RUN aws --version
RUN rm -rf /tmp/awscli

USER node

COPY --chown=node:node api api
COPY --chown=node:node web web
COPY --chown=node:node scripts scripts

CMD sleep infinity

# python-console
# ------------------------------------------------
FROM python:3.12.3-slim-bullseye as python-console

RUN apt-get update && apt-get install -y \
    openssl curl gnupg gnupg2 gnupg1 groff postgresql-client unzip \
    && pip install poetry

WORKDIR /home/node/app

COPY python python
COPY .env.defaults .env.defaults

WORKDIR /home/node/app/python
RUN poetry install --no-interaction --no-ansi
WORKDIR /home/node/app

RUN addgroup --system --gid 1000 node && \
    adduser --system --uid 1000 node --ingroup node
RUN chown -R node:node /home/node/app

# Install awscli
RUN mkdir -p /tmp/awscli
COPY aws-public-key.gpg /tmp/awscli/key.gpg
RUN gpg --import /tmp/awscli/key.gpg
RUN sh -c 'curl -o "/tmp/awscli/awscliv2.sig" https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip.sig'
RUN sh -c 'curl -o "/tmp/awscli/awscliv2.zip" "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip"'
RUN gpg --verify /tmp/awscli/awscliv2.sig /tmp/awscli/awscliv2.zip
RUN unzip -u -d /tmp/awscli/ /tmp/awscli/awscliv2.zip
RUN /tmp/awscli/aws/install
RUN aws --version
RUN rm -rf /tmp/awscli

CMD sleep infinity
