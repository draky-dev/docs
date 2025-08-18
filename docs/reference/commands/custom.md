---
sidebar_position: 2
---

# Custom commands

## Introduction
Any script in the project's `.draky` directory with a name ending in
`.dk.sh` is considered a command. It will be automatically added to the list of available commands in the output of the
`draky -h` command, and can be run using `draky [my-command]`, where `[my-command]` is the part of its filename that
comes before the `.dk.sh` suffix. The specific location of the file doesn't matter.

There are two types of custom commands.

## Commands executed on the host

This is the default behavior. These commands can run commands inside the container, but only through the means available on
the host, such as the `docker exec` command.

These commands are useful if they need to do something across multiple containers, or need access to the host
(such as a database dump that needs to be saved on the host's filesystem).

## Commands executed inside the container

To make a command execute inside the container, its filename should end with `.[service].dk.sh`, e.g.:
`my-command.php.dk.sh`. draky recognizes that `php` is the name of the service in the `docker-compose.yml` file,
and will run this command **inside that service's container**. This means that this script will have access to all
programs inside the container.

## Metadata

You can associate metadata with a custom command. For that, create a `yaml` file with the same name as a command file, but
with `.yml` appended to it.

The following metadata values are supported:
- `help` [string]: Information displayed in the terminal next to the command in draky's `-h` output.
- `user` [string/int]: This value is used only for commands that run inside containers. It allows you
  to run the command as a given user inside the container. You can use the user's numeric ID or name. If a name is used,
  the user must exist in the container's `/etc/passwd` file.

## stdin

All custom commands can handle standard input. It means that you can have a script registered
as a command executed inside your `database` container like so:

**.draky/mysql.database.dk.sh**:
```bash
#!/usr/bin/env bash
mysql -uroot "$@" < /dev/stdin
```

And that command could be invoked in the following way:

```bash
$ draky mysql mydatabase < ./dbdump.sql
```

That way you can pass or redirect input into your commands to feed it into processes running inside
the containers.