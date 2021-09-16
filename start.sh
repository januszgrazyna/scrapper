#!/bin/bash

pushd dist 2>&1 > /dev/null

FILE_CONTENTS=$(cat ./run.txt)

if [[ "${FILE_CONTENTS:0:1}" == "?" ]]; then
    echo "Runfile starts with '?'. Run will not proceed."
    exit 0
fi

ARGS=$(echo "$FILE_CONTENTS" | sed -e "s/.*PM:\s*\(.*\)/\1/" | sed -e "s/.*AM:\s*\(.*\)/\1/")
echo "Args: $ARGS"
CMD="node src/index.js $ARGS"

set -e
# DANGEROUS PART
eval "$CMD"
set +e
popd 2>&1 > /dev/null

exit 0