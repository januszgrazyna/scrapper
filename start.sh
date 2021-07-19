#!/bin/bash


CMD=$(cat ./run.txt | sed -e "s/.*PM:\s*\(.*\)/\1/" | sed -e "s/.*AM:\s*\(.*\)/\1/")
echo "Command: $CMD"

pushd dist 2>&1 > /dev/null
node src/index.js $CMD
popd 2>&1 > /dev/null

exit 0