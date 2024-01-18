.ONESHELL:
.PHONY: $(MAKECMDGOALS)
SHELL = /bin/bash

ROOT = $(shell pwd -P)
NODE_PACKAGE_JSON_PATH = .
NODE_DOCKER_IMAGE = node:20.3.1-alpine3.18

watch:
	docker run --rm -it -w=/var/node -u=$(id -u ${USER}):$(id -g ${USER}) -p 3000:3000 -v "${ROOT}/${NODE_PACKAGE_JSON_PATH}:/var/node/:cached,rw" ${NODE_DOCKER_IMAGE} yarn start -- --host 0.0.0.0

build:
	docker run --rm -it -w=/var/node -u=$(id -u ${USER}):$(id -g ${USER}) -p 3000:3000 -v "${ROOT}/${NODE_PACKAGE_JSON_PATH}:/var/node/:cached,rw" ${NODE_DOCKER_IMAGE} yarn build

install:
	docker run --rm -it -w=/var/node -u=$(id -u ${USER}):$(id -g ${USER}) -v "${ROOT}/${NODE_PACKAGE_JSON_PATH}:/var/node/:cached,rw" ${NODE_DOCKER_IMAGE} yarn install
