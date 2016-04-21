#!/usr/bin/env bash

if [[ "start test run" =~ $1 ]]; then
    CMD="/opt/nodejs/bin/npm "
    CMD+=( "${@:1}" )
else
    CMD=( "$@" )
fi

exec ${CMD[*]}
