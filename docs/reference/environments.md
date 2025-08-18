---
sidebar_position: 3
---

# Environments

draky allows you to configure multiple environments for a single project. This can be useful
if, for example, you need another environment for testing that is more similar to production.

The `docker-compose.yml` or `docker-compose.recipe.yml` for each environment should be
placed in the `.draky/env/<environment-name>/` directory in your project.

The default environment is `dev`.

## Switching environments

To act on a specific environment, pass the `DRAKY_ENV` environment variable to draky.

Containers are namespaced by environment, so you can run multiple environments at the same time,
provided they don't have conflicting exposed ports.

## Commands and variables

Commands and variables can be scoped to a specific environment.

### Commands

To scope a command, add the `environments` section to the command's companion YAML file, with the list
of environments it should be available in.

### Variables

To scope a variables file, add the `environments` section to it, with the list
of environments its variables should be available in.
