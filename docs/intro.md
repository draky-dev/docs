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

1. Learn about **[templates](/docs/reference/templates)**.
2. Go to the root directory of your project, and run `draky env init`. If you installed any custom template, you will be able to select it.
3. Modify the template's files and `docker-compose.yml` to fit your project (see: **[docker-compose.yml](/docs/reference/docker-compose)**, and **[configuration files](/docs/reference/configuration-files)**).
4. Run `draky env up` to start your environment.
