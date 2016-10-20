#!/usr/bin/env bash

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
TARGET_DIR="${SCRIPT_DIR}/lev-api-docs"
GIT_REPO=https://github.com/UKHomeOffice/lev-api-docs.git
cd ${SCRIPT_DIR}

if [ -d "${TARGET_DIR}" ]
then
    cd "${TARGET_DIR}"
    git pull
else
    git clone "${GIT_REPO}" || exit 1
fi

# straight-up force scripts to have exec permissions to fix GIT stupidity!
find ${TARGET_DIR} -type f -name '*.sh' -exec chmod +x {} \;

${TARGET_DIR}/mock/build_mock_api_docker.sh
