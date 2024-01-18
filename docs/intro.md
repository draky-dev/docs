---
sidebar_position: 1
---

# Quick start

## Requirements

- docker

## Installation

1. Download the latest release from [here](https://github.com/draky-dev/draky/releases).
2. Put the `draky` script in your `/usr/local/bin` directory.

## Usage

### Creating a new environment
1. Go to the root directory of your project, and run `draky env init`
2. Use the default template or **[create one yourself](/docs/tutorials/create-custom-template)**.
3. Modify the template's files and `docker-compose.yml` to fit your project (see: **[docker-compose.yml](/docs/reference/docker-compose)**, and **[configuration files](/docs/reference/configuration-files)**).
4. Run `draky env up` to start your environment.
