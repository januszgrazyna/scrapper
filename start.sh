#!/bin/bash


FILE_CONTENTS=$(cat ./run.txt)

if [[ "${FILE_CONTENTS:0:1}" == "?" ]]; then
    echo "Runfile starts with '?'. Run will not proceed."
    exit 0
fi

CMD=$(echo "$FILE_CONTENTS" | sed -e "s/.*PM:\s*\(.*\)/\1/" | sed -e "s/.*AM:\s*\(.*\)/\1/")
echo "Command: $CMD"

pushd dist 2>&1 > /dev/null
set -e
node src/index.js $CMD
set +e
popd 2>&1 > /dev/null

exit 0