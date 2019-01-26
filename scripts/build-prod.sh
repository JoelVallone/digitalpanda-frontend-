#!/bin/bash
SCRIPT_FOLDER="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC_FOLDER="${SCRIPT_FOLDER}/../src"
PROD_FOLDER="${SCRIPT_FOLDER}/../dist/digitalpanda"
DOCKER_IMAGE_BIN_FOLDER="${SCRIPT_FOLDER}/../../digitalpanda-infrastructure/docker/images/frontend-angular/digitalpanda-frontend"

echo "=> Build frontend"
rm -rf ${PROD_FOLDER}
npm install
ng build --prod

echo "=> Copy frontend data to docker image external folder"
rm -rf ${DOCKER_IMAGE_BIN_FOLDER}
cp -r ${PROD_FOLDER} ${DOCKER_IMAGE_BIN_FOLDER}

echo "Build & push image to registry"
VERSION="1.0.0"
REGISTRY="localhost:5000"
IMAGE_NAME=${REGISTRY}/digitalpanda-frontend:${VERSION}
docker build -t ${IMAGE_NAME} ${SCRIPT_FOLDER}/../
docker push ${IMAGE_NAME}
