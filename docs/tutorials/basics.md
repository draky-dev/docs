---
sidebar_position: 1
---

# Basics

## 0. Introduction

draky is a Docker-based environment manager made to help you manage your Docker
environments whenever you need them. Unlike other tools like Lando, Docksal, or DDEV,
this tool was designed to be unopinionated and keep you as close to your docker-compose.yml as
possible. This tutorial will show you how to work with it.

## 1. Installation

First, [install](/docs/intro#installation) draky.

## 2. Initializing a new project

To initialize a new project, run `draky env init` in the new project's root directory, and choose
the default template.

```text
$ draky env init
draky core has been turned off.
draky core is live.
Leaving the context: 'None'.
draky core has been turned off.
Entering the context: '/home/luken/IdeaProjects/test-draky/.draky'.
draky core is live.
Enter project id: test-draky

[0]: default

Enter template number: 0
Project has been initialized.
```

This is the directory structure that has been created:

```
.draky/
  commands/
    README.txt
  env/
    dev/
      docker-compose.recipe.yml
  services/
    README.md
  .gitignore
  core.dk.yml
  local.dk.yml.example
  template.dk.yml
```

## 3. Recipe, docker-compose.yml, and services

The default template comes with an example `docker-compose.recipe.yml` file for the default `dev`
environment. It looks just like a regular `docker-compose.yml` file, but it's not. draky processes
the recipe to generate the final `docker-compose.yml` file. Working with a recipe gives us some
advantages.

What are these advantages?

Let's create a service definition in a separate directory and reference it from our recipe.

```
.draky/
  commands/
    README.txt
  env/
    dev/
      docker-compose.recipe.yml
  services/
    mariadb/        <-- this is new
      services.yml  <-- this is new
    README.md
  .gitignore
  core.dk.yml
  local.dk.yml.example
  template.dk.yml
```

```yaml
# .draky/env/dev/docker-compose.recipe.yml
services:
  database:
    extends:
      file: ../../services/mariadb/services.yml
      service: mariadb
```

```yaml
# .draky/services/mariadb/services.yml
services:
  mariadb:
    image: mariadb:12
    environment:
      MARIADB_ALLOW_EMPTY_ROOT_PASSWORD: true
      MARIADB_DATABASE: main
    ports:
      - "3306:3306"
```

Assuming our `docker-compose.recipe.yml` file would be a normal `docker-compose.yml` file, the paths
to volumes in the `services.yml` file would need to be relative to the parent `docker-compose.yml` file.

Part of the processing rewrites paths so that they can be specified
relative to the `services.yml` file, allowing us to encapsulate our services and their dependencies
and make them easier to reuse.

Another thing this processing enables is [addons](/docs/reference/addons/about), which are powerful scripts that
apply custom logic to the generation of the `docker-compose.yml` file, making your life easier.

But more on them later.

## 4. Variables

draky allows us to define variables that will be available in the `docker-compose.yml` file.
They can be stored in configuration files with the `dk.yml` extension, allowing us to better organize
our configuration.

Let's expose some of MariaDB's service properties as variables.

```yaml
# .draky/services/mariadb/variables.dk.yml
variables:
  MARIADB_VERSION: 12
  MARIADB_DATABASE: main
  MARIADB_ALLOW_EMPTY_ROOT_PASSWORD: true
  MARIADB_EXPOSED_PORT: 3306
```

```yaml
# .draky/services/mariadb/services.yml
services:
  mariadb:
    image: "mariadb:${MARIADB_VERSION}"
    environment:
      MARIADB_ALLOW_EMPTY_ROOT_PASSWORD: "${MARIADB_ALLOW_EMPTY_ROOT_PASSWORD}"
      MARIADB_DATABASE: "${MARIADB_DATABASE}"
    ports:
      - "${MARIADB_EXPOSED_PORT}:3306"
```

And that's it! Now we can edit all important bits in a single, clean file.

There is more to variables. You can construct variable values from other variables.
Let's see what it looks like:

```yaml
# .draky/services/mariadb/variables.dk.yml
variables:
  MARIADB_VERSION: 12
  MARIADB_IMAGE: "mariadb:${MARIADB_VERSION}" # <-- added dynamic variable
  MARIADB_DATABASE: main
  MARIADB_ALLOW_EMPTY_ROOT_PASSWORD: true
  MARIADB_EXPOSED_PORT: 3306
```

```yaml
# .draky/services/mariadb/services.yml
services:
  mariadb:
    image: "${MARIADB_IMAGE}" # <-- dynamic variable
    environment:
      MARIADB_ALLOW_EMPTY_ROOT_PASSWORD: "${MARIADB_ALLOW_EMPTY_ROOT_PASSWORD}"
      MARIADB_DATABASE: "${MARIADB_DATABASE}"
    ports:
      - "${MARIADB_EXPOSED_PORT}:3306"
```

You can also define dependencies between variable files, ensuring the correct order of variable
loading, which would be important when defining dynamic variables depending on variables from
other files. [You can learn more about that in the documentation](/docs/reference/configuration-files).

The point is that each configuration has parts that it would be useful to be able to change
easily, and draky's variables allow us to do that.

## 5. Commands

### Host commands

The next big feature draky provides is custom commands. You can define commands as normal
scripts with the `dk.sh` extension.

Let's do that.

```bash
# .draky/test-command.dk.sh

#!/usr/bin/env sh
ls -la /.dockerenv
```

Our command is now available as `draky test-command`. However, when you try to run it, you will see:

```text
$ draky test-command
ls: cannot access '/.dockerenv': No such file or directory
```

This is because this command runs on the host, so the `/.dockerenv` file is not available.

Host-run commands can be useful if we need to process output coming from multiple containers.

### Container commands

We can also create commands that run inside containers!

Let's create a command that will pass arguments to the `mariadb` client inside the mariadb container.

```bash
# .draky/services/mariadb/commands/mariadb.database.dk.sh

#!/usr/bin/env sh
mariadb -u root "$@"
```

Now when we run `draky mariadb --version` we will see something like:

```text
$ draky mariadb --version
mariadb from 12.0.2-MariaDB, client 15.2 for debian-linux-gnu (x86_64) using  EditLine wrapper
```

We managed to use the `mariadb` client from the container, as if it were running
directly on the host!

This worked because of the naming scheme of the command file. Basically the `database` part of the
`mariadb.database.dk.sh` command filename tells draky that this script should be executed inside the
`database` container. And `database` is the name of the service defined in the `docker-compose.recipe.yml`
file.

But there is more!

We can also run commands inside the container as a specific user. To do this, we need to add a
special "companion" file to the command. That file contains some additional information about the
command.

```yaml
# .draky/services/mariadb/commands/mariadb.database.dk.sh.yml

user: 1000 # Either id or username can be used here.
```

Note: When wrapping a single command inside a container, like in our `mariadb` example,
it's good practice to redirect stdin into it. That way you can pipe data from the
host if needed, and so on.

So, it will look like this:

```bash
# .draky/services/mariadb/commands/mariadb.database.dk.sh

#!/usr/bin/env sh
mariadb -u root "$@" < /dev/stdin
```

### Variables in commands

To make your commands configurable, you can use variables. Yes, variables that were explained
earlier are available inside the commands, even if these commands run inside a container!

So if we change our command like that:

```bash
# .draky/services/mariadb/commands/mariadb.database.dk.sh

#!/usr/bin/env sh
mariadb -u root "$@" < /dev/stdin
echo "MARIADB_IMAGE: ${MARIADB_IMAGE}"
```

You would get output:

```text
$ draky mariadb --version
mariadb from 12.0.2-MariaDB, client 15.2 for debian-linux-gnu (x86_64) using  EditLine wrapper
MARIADB_IMAGE: mariadb:12
```

More about custom commands can be found in the [documentation](/docs/reference/commands/custom).

## 6. Multiple environments

draky also allows you to create multiple environments, each with its own `docker-compose.recipe.yml`
file, its own variables, and commands. All configuration files and commands can be scoped to
specified environments.

You can learn more about this feature in the [documentation](/docs/reference/environments).

## 7. Addons

Another concept worth briefly mentioning is addons. Addons let you process a recipe before it’s
converted into a `docker-compose.yml` file. For example, they can automatically attach a custom
entrypoint to any service to provide additional functionality.

We provide the addon, which does exactly that: `draky-entrypoint`.

Its powerful features deserve a dedicated tutorial.
