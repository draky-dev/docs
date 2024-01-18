---
sidebar_position: 2
---

# Custom commands

## Introduction
Any script in the project's `.draky` directory, that has a name ending with the
`.dk.sh` is considered a command, will be automatically added to the list of available commands in the output of the
`draky -h` command, and can be run by using `draky [my-command]` where `[my-command]` is the part of its filename that
comes before the `.dk.sh` suffix. The specific location of the file doesn't matter.

There are two types of custom commands.

## Commands executed on the host

This is the default behavior. These commands can run stuff inside the container, but only through the means available on
the host, like the `docker exec` command.

These commands are useful if they need to do something across multiple containers, or need to have access to the host
(like the database dump that needs to be saved on the host's filesystem).

## Commands executed inside the container

To make command executed inside the container, its filename should end with `.[service].dk.sh`. E.g.:
`my-command.php.dk.sh`. draky can recognize that the `php` is the name of the service in the `docker-compose.yml` file,
and will run this command **inside this service's container**. It means that this script will have access to all
programs inside the container.

## Metadata

You can associate metadata with a custom command. For that, create a `yaml` file with the same name as a command, but
with `.yml` appended to it.

The following metadata values are supported:
- `help` [string]: Information displayed in the terminal next to the command in the draky's `-h` output.
