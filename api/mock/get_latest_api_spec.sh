#!/usr/bin/env bash

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
TARGET_DIR="./lev-api-docs"
GIT_REPO=https://github.com/UKHomeOffice/lev-api-docs.git
cd $SCRIPT_DIR

if [ -d "${TARGET_DIR}" ]
then
    cd "${TARGET_DIR}"
    git pull
    cd "${SCRIPT_DIR}"
else
    git clone "${GIT_REPO}" || exit 1
fi

# straight-up force scripts to have exec permissions to fix GIT stupidity!
find lev-api-docs/ -type f -name '*.sh' -exec chmod +x {} \;
