---
sidebar_position: 1
---

# Quick start

## Why draky?

If you are not sold on `draky` yet, see the [What does draky solve?](/docs/other/what-draky-solves)
page to see how it can help you.

## Requirements

- bash
- docker

## Installation

1. Download the latest release from [here](https://github.com/draky-dev/draky/releases).
2. Put the `draky` script in your `/usr/local/bin` directory.

## Updating

1. Run `draky core destroy`.
2. Replace your `/usr/local/bin/draky` script with a newer release.
3. That's it!

## Usage

### Creating a new environment

1. Learn about **[templates](/docs/reference/templates)** (existing templates can be a great starting point for understanding draky's environments).
2. Go to the root directory of your project, and run `draky env init`. If you installed any custom template, you will be able to select it.
3. Modify the template's files and `docker-compose.yml` to fit your project (see: **[docker-compose.yml](/docs/reference/docker-compose)**, and **[configuration files](/docs/reference/configuration-files)**).
4. Run `draky env up` to start your environment.

## Platforms

### Linux

Works out of the box.

### Windows

Works in WSL. When using Docker Desktop, it has to be configured to expose the docker socket in WSL.

### MacOS

You may have a permission problem connecting to the docker socket. If that's the case, the current
workaround is to add read/write permissions on the `/var/run/docker.sock` socker inside the `draky`
container.

```bash
draky core create # Make sure that the draky container is up.
docker exec draky chmod o+rw /var/run/docker.sock
```

This may need to be repeated after restarting Docker Desktop.

## Helpers

### docker.sock path override

If you want `draky` to connect with docker socket that exists under a non-standard path, you may
provide the `DRAKY_DOCKER_SOCKET` environmental variable, which will override the default socket
path.

This might be useful if you use multiple docker virtualizations, exposed under multiple sockets.