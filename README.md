# cpf-reporter

CPF Reporter application maintained by the USDR Grants program.

⚠️ *This application is in active development and is pending initial release.
Certain things (including this README) are currently a work-in-progress.*

## What's this?

TODO

## Architecture

TODO

## Code Organization

Code for this service can generally be considered under three categories:

### IaC

Infrastructure-as-code (IaC) used to provision the target environment, which is written with Terraform, and normally run during deployment.
The main Terraform project is located in the `terraform/` directory.

### Runtime - API Side

TODO

## Runtime - Web Side

TODO

## Local development via Docker

To use Docker for local development, run the following commands:
- `docker compose -f ./docker-compose.dev.yml build` - to build the docker images
- `docker compose -f ./docker-compose.dev.yml up` - to run the docker containers
- `docker compose -f ./docker-compose.dev.yml run --rm -it console /bin/bash` - to go into the console container and INSIDE the container, run the following:
  - `yarn rw prisma migrate dev` - migrates the local DB
  - `yarn rw prisma db seed` - seeds the local DB
- Now you should be able to open your browser to `localhost:8910` and hit the web server in the redwood container.

To use Docker to run the pytest suite, run the following commands (after starting the docker containers via `up`):
- `docker compose -f ./docker-compose.dev.yml run --rm -it python-console /bin/bash` - to go into the python container
  - `poetry run pytest` - to run the pytest suite

## Development

We recommend checking out the [Getting Started with RedwoodJS](./docs/redwood-introduction.md) guide to get familiar with our development patterns.

## Contributing

This project wouldn’t exist without the hard work of many people. Please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) to find out how you can help.

## Release Management

Releases are versioned using a `YYYY.inc` scheme that represents the year of the release, and the incremental release number for that year.
You can view a list of all historical releases on the [Releases page](https://github.com/usdigitalresponse/cpf-reporter/releases).

For details on deploying releases to Production, see our [Release Process](./docs/releasing.md) documentation.
