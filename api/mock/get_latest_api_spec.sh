#!/usr/bin/env bash

cd $(dirname $0)
TARGET_DIR="./lev-api-mock"
GIT_REPO="https://github.com/UKHomeOffice/lev-api-mock.git"

if [ -d "${TARGET_DIR}" ]
then
    cd "${TARGET_DIR}"
    git pull
else
    # TODO: remove the branch part once merged
    git clone -b "mock-from-FE-acceptance-tests" "${GIT_REPO}" "${TARGET_DIR}" || exit 1
fi
