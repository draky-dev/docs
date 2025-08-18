---
sidebar_position: 3
---

# Environments

draky allows you to configure multiple environments for a single project. This might be useful
if you, for example, need another environment for testing, more similar to the production one.

`docker-compose.yml` or `docker-compose.recipe.yml` for each environment you want to have should be
placed in the `.draky/env/<environment-name>/` directory in your project.

The default environment is `dev`.

## Switch environment

To act on a specific environment pass the `DRAKY_ENV` environmental variable to draky.

Containers are namespaced by environment, so you can run multiple environments at the same time,
provided they don't have conflicting exposed ports.

## Commands and variables

Commands and variables can be scoped to a specific environment.

### Commands

To scope command, add the `environments` section to the command's companion yml file, with the list
of environments it should be available in.

### Variables

To scope a variables file, add the `environments` section to it, with the list
of environments its variables should be available in.
