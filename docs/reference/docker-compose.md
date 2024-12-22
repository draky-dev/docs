---
sidebar_position: 1
---

# docker-compose.yml

## Introduction
`docker-compose.yml` is a final definition of your environment. draky allows you to use your own
`docker-compose.yml` file, but it also allows for generating one based on the recipe. The
difference between the directly providing the `docker-compose.yml` file, and generating one is
that in the case of the recipe [addons](/docs/reference/addons/about) can hook into the generation process and automatically
tweak the resulting `docker-compose.yml` file.

draky is looking for the docker-compose file in the following location: `.draky/env/dev/docker-compose.yml`.

## Recipe

The set of instructions telling draky how to build a `docker-compose.yml` file is called *recipe*.

draky is looking for the *recipe* file in the following location: `.draky/env/dev/docker-compose.recipe.yml`.

### Recipe specification
Recipe file has a single key `services` where services' configurations are located. Its spec is almost
the same as the `docker-compose.yml` file, with the only difference being that every service can
have an optional `draky` property.

`draky` property stores a dictionary with the following values:

`addons` (optional): The list of [addons](/docs/reference/addons/about) enabled for the specific service. Addons
can alter the service they are enabled on.

For each service you can add `addons` section to specify the list of addons enabled for this service. These addons need
to be [properly installed first](/docs/reference/addons/about#installation).

### Recipe example

**.draky/env/dev/docker-compose.recipe.yml**:

```
services:
  webserver:
    image: "${DRAKY_NGINX_IMAGE}"
    environment:
      DRAKY_OVERRIDE_NGINX_BACKEND_HOST: "${DRAKY_NGINX_BACKEND_HOST}"
      DRAKY_OVERRIDE_NGINX_SERVER_NAME: "${DRAKY_NGINX_DOMAIN}"
      DRAKY_OVERRIDE_NGINX_SERVER_ROOT: "${DRAKY_NGINX_FRONT_CONTROLLER}"
      DRAKY_ENTRYPOINT_DO_CREATE_HOST_USER: "${DRAKY_HOST_UID}"
    ports:
      - "${DRAKY_NGINX_PORT}:80"
    volumes:
      - "${DRAKY_PROJECT_ROOT}:/var/www/html:cached,ro"
      - "./resources:/draky-entrypoint.resources"
    addons:
      - draky-entrypoint
    depends_on:
      - php
  php:
    extends:
      file:  ../../services/php/services.yml
      service: php
```

**.draky/services/php/services.yml**:

```
services:
  php:
    image: "${DRAKY_PHP_IMAGE}"
    environment:
      DRAKY_HOST_UID: "${DRAKY_HOST_UID}"
      DRAKY_HOST_GID: "${DRAKY_HOST_GID}"
      DRAKY_OVERRIDE_HOST_IP: "${DRAKY_HOST_IP}"
      DRAKY_OVERRIDE_HOST_USERNAME: host
      DRAKY_OVERRIDE_HOST_GROUP: host
      DRAKY_OVERRIDE_MAILHOG_HOST: mailhog
      DRAKY_OVERRIDE_WEBSERVER_HOST: webserver
      PHP_IDE_CONFIG: "${DRAKY_PHP_IDE_CONFIG}"
    volumes:
      - "${DRAKY_PROJECT_ROOT}:/var/www/html:cached,rw"
```

In the above example the `DRAKY_OVERRIDE_*` variables and the `./resources:/draky-entrypoint.resources` volume are being used by
the custom entrypoint provided by the [draky-entrypoint](/docs/reference/addons/draky-entrypoint-addon) addon. Note
that the entrypoint is not included in the service's definition. It's being automatically configured and
mounted in the container, provided that the addon files have been added to the directory tree, and the addon is
enabled for the given service in the recipe.

## .env

All variables from draky's configuration files will be automatically gathered in the `.env` file that is accompanying the
`docker-compose.yml` file.