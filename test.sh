#!/usr/bin/env bash

usage="Usage: ${0} <ci-test-job>
Examples:
    ${0} test:ci
    ${0} test:browser
"
[ -z "${1}" ] && printf "ERROR: no ci-test-job specified!\n\n${usage}" && exit 1

echo "-----------------------
running ${1}..."

touch test.log
tail -f test.log &
TL=$!

npm run "${1}" > test.log 2>&1
EC=$?

kill "${TL}"
exit "${EC}"
