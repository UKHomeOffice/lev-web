#! /usr/bin/env bash

set -e

npm install --quiet && npm test;

if [ $? -eq 0 ]
then
    exit 0
fi

exit 1
