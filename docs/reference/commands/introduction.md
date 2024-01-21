---
sidebar_position: 1
---

# Introduction
draky is pretty robust when it comes to commands. It provides you with some built-in commands for managing your
environment, but also allows you to create your own custom commands that can be run inside or outside the
containers.

You can run `draky -h` and add `-h` to any command, to get help regarding the tree of available commands.

## stdin

All custom commands can handle `stdin` input. It means that you can have a script executed inside your
`database` container like so:

**mysql.database.dk.sh**:
```bash
#!/usr/bin/env bash
mysql -uroot "$@" < /dev/stdin
```

That would be invoked as a command in a following way:

```bash
$ draky mysql mydatabase < ./dbdump.sql
```

That way you can pass/redirect input into your commands to feed it into processes running inside
the containers.