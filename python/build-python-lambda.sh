#!/usr/bin/env bash
# TODO where should this live?
# cribbed from the python-function-zips GH action

cd /python/
apt update && apt install -y zip
POETRY_VIRTUALENVS_OPTIONS_ALWAYS_COPY="true"
POETRY_VIRTUALENVS_OPTIONS_NO_PIP="true"
POETRY_VIRTUALENVS_OPTIONS_NO_SETUPTOOLS="true"
ARTIFACTS_PATH=$(pwd)/dist/zipballs
rm -rf ${ARTIFACTS_PATH}; mkdir -p ${ARTIFACTS_PATH}
echo "Installing poetry"
pip install poetry
echo "Building lambda.zip"
INSTALLED_PACKAGE_DIR=$(poetry env info --path --no-interaction --no-ansi)/lib/python3.12/site-packages
poetry install --only main --sync --no-interaction --no-ansi
echo "Removing pycache files"
find src ${INSTALLED_PACKAGE_DIR} | grep -E "(/__pycache__$|\.pyc$|\.pyo$)" | xargs rm -rf
pushd ${INSTALLED_PACKAGE_DIR}
echo "Zipping installed packages"
zip -r ${ARTIFACTS_PATH}/lambda.zip .
popd
echo "Zipping src"
zip -r $ARTIFACTS_PATH/lambda.zip src

