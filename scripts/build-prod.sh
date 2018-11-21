#!/bin/bash

SCRIPT_FOLDER="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC_FOLDER="${SCRIPT_FOLDER}/../src"
PROD_FOLDER="${SCRIPT_FOLDER}/../dist/digitalpanda"
DOCKER_IMAGE_BIN_FOLDER="${SCRIPT_FOLDER}/../../digitalpanda-infrastructure/docker/images/frontend-angular/digitalpanda-frontend"

echo "=> Build frontend"
rm -rf ${PROD_FOLDER}
npm install
ng build --prod

echo "=> Copy frontend data to docker image folder"
rm -rf ${DOCKER_IMAGE_BIN_FOLDER}
cp -r ${PROD_FOLDER} ${DOCKER_IMAGE_BIN_FOLDER}
