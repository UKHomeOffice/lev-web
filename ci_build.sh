#!/usr/bin/env bash
set -e

# Config
# ======================================================================
IMAGE="lev-web"

REGISTRY="quay.io/ukhomeofficedigital"

# Misc variables
# ======================================================================
BUILD_HOME_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
# Grep package.json to extract version
PACKAGE_VERSION=$(grep version package.json \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
# This will work even when build number set to empty string...
VERSION="v${PACKAGE_VERSION}-${BUILD_NUMBER:-local}-${GIT_COMMIT:-$(git rev-parse HEAD)}"
TAG=${REGISTRY}/${IMAGE}:${VERSION}

# Functions
# ======================================================================
function build_image {
  echo "Starting docker image build with params:'$@'..."
  docker build -t ${TAG} .
  return $?
}

function push_image {
  echo "Starting docker image push with params:'$@'..."
  docker push ${TAG}
  return $?
}

function if_ci_push_image {
  if [ "${BUILD_NUMBER}" != "" ]; then
    push_image
    return $?
  else
    return 0
  fi
}

# Start!
# ======================================================================

# Init
cd ${BUILD_HOME_DIR}

# Build (and test) and push
build_image && if_ci_push_image

ok="$?"

# Report status
if [ ${ok} -ne 0 ]; then
  echo "Failed build"
  exit 1
else
  echo -n "$(git rev-parse HEAD)">artefacts/gitrev
  echo -n "${VERSION}">artefacts/lev-web_version
  echo "Completed build"
  exit 0
fi
