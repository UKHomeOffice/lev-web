#!/usr/bin/env bash

echo "-----------------------
running ${1}..."

touch test.log
tail -f test.log &
TL=$!

npm run "${1}" > test.log 2>&1
EC=$?

kill "${TL}"
exit "${EC}"
