#!/bin/bash


CMD=$(cat ./run.txt | sed -e "s/.*PM:\s*\(.*\)/\1/" | sed -e "s/.*AM:\s*\(.*\)/\1/")
echo "Command: $CMD"

pushd ./dist/src
node ./index.js $CMD
popd