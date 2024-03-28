#! /bin/bash

echo "NOTE: This builds a local Python Lambda zip artifact for testing."
echo "It is NOT intended to be used to generate artifacts in CD pipelines."
echo ""

if ! command -v zip &> /dev/null
then
    echo "zip could not be found in PATH"
    echo "Install zip and try again"
    exit 1
fi

startPath="$(dirname $(realpath $0))"
distPath="$startPath/dist"
zipballPath="$distPath/lambda.zip"
pushd $startPath > /dev/null
installedPackagesPath="$(poetry env info -p)/lib/python3.12/site-packages"
popd > /dev/null

echo "Install production-only packages"
pushd $startPath > /dev/null
poetry install --only main --sync --quiet --no-interaction --no-ansi
popd > /dev/null

echo "Cleaning bytecode from distributable source"
find "$startPath/src" "$installedPackagesPath" | grep -E "(/__pycache__$|\.pyc$|\.pyo$)" | xargs rm -rf

echo "Building distributable lambda artifact $zipballPath"
mkdir -p "$distPath"
rm -f "$zipballPath"

pushd "$installedPackagesPath" > /dev/null
echo "Zipping contents from $(pwd)"
zip -r "$zipballPath" . > /dev/null
popd > /dev/null

pushd "$startPath" > /dev/null
echo "Zipping contents from $(pwd)/src"
zip -r "$zipballPath" src > /dev/null
popd > /dev/null

zipBallSizeBytes=$(stat --printf="%s" "$zipballPath")
zipBallSizeHuman=$(printf $zipBallSizeBytes | numfmt --to=iec)
echo "Artifact size: $zipBallSizeBytes bytes ($zipBallSizeHuman)"
echo "$zipballPath"
