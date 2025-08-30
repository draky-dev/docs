---
sidebar_position: 1
---

# What does draky solve?

draky addresses several common annoyances of Docker Compose.

## Encapsulation

### Volumes

#### Problem

You want to make your service definition easily reusable. For this purpose, you moved it
from `docker-compose.yml` to a different directory to keep it there alongside all its dependencies,
including volumes. Then you referenced it in `docker-compose.yml` with the `extends` property.

However, there is a problem: volumes of extended services must be relative to the `docker-compose.yml` file,
not your service file. This means your service definition cannot be completely decoupled from
the `docker-compose.yml` file. It's always coupled to its location relative to the `docker-compose.yml` file.

As a result, you cannot freely move it around; if you copy it to another directory to adapt it for another environment, it won't work without also adjusting the volume paths.

Wouldn't it be nice if you could define volumes relative to the service file? If that were the
case, you wouldn't need to care where your service file is located. You could treat it
as a truly decoupled and encapsulated configuration.

#### Solution

draky dynamically creates a `docker-compose.yml` based on a recipe and, in the process,
translates volume paths from those relative to the service file into ones relative to the
`docker-compose.yml` file.

This means you can use volume paths relative to the service file, and the final `docker-compose.yml`
will still find everything it needs because paths will be adjusted. This allows creating truly
decoupled configurations.

### Variables

#### Problem

Traditionally, if you want to have a set of variables available in the service definition, you either
define them in an `.env` file or pass them directly to the `docker-compose` command. Both options
have major drawbacks. Passing all variables every time you run `docker-compose` is inconvenient, and
using a single `.env` file is not much better when you have multiple services — you may prefer to keep
service-specific variables alongside the service definition rather than in a single catch‑all file.

#### Solution

draky compiles an `.env` file from multiple `*.dk.yml` files that you can place anywhere in your
`.draky` directory. This enables a cleaner organization of variables — you can keep service‑specific
variables alongside the service definition, further improving encapsulation.

## Commands

### Problem

You have many projects and need access to commands inside containers. It might be the
`composer` command or the `console` command in the case of a Symfony app. Or maybe you want a
command that dumps a database, runs migrations, and so on.

Traditionally, you would write a script that runs `docker-compose exec [service]` and executes
the command inside the container, passing arguments along the way. This works, but it’s also
awkward for several reasons:
1. Your script includes not only the logic you want to run inside the container, but also
   boilerplate for executing scripts inside containers (`docker-compose exec [service]`).
2. For longer scripts, you might have to use a heredoc to pass the script into the container,
   which can be cumbersome and hard to read.
3. Your script runs only from a single location. To run it from elsewhere, you need to `cd`
   to the script’s directory or use a path. Depending on your current working directory, you
   may need different commands. Adding the script’s location to your `$PATH` comes with a
   different set of problems.
4. It’s not easy to pass all your project’s environment variables into the container, so they’re
   available to your command.

### Solution

draky lets you define commands and auto‑wires them in a way that minimizes boilerplate
and adds several useful features.

1. To create a draky command, create a `[command name].[service].dk.sh` file anywhere in the `.draky/`
   directory. The file contains only the logic that should run inside the container. This is more
   IDE‑friendly (heredocs may not be highlighted correctly).
2. You can execute such a command anywhere in the project’s directory tree with a simple `draky [command name]`.
3. Any additional arguments (and stdin) are passed to the command automatically.
4. All environment variables defined in draky’s configuration are available inside the command’s
   script.
5. Commands can also be scoped to specific environments (draky can have different configurations,
   including commands, for multiple environments).

## Modifying containers at runtime

### Problem

Traditionally, if you want to modify “vanilla” containers (like `php` or `nginx`) to apply your custom
configuration, you need either:
1. To create a custom image based on a “vanilla” one, with some modified files. This requires
   building/hosting images and is not very convenient for development or prototyping.
2. To modify a “vanilla” image by mounting a volume with a modified file. This is fine
   as long as there are only a few files to modify. The problem is that each overridden file
   requires its own volume, which slowly turns your service definition into a mess.

Wouldn't it be nice if you could override any file in the container's filesystem at any time—without
having to remember to keep a volume for it?

### Solution

`draky-entrypoint` lets you override as many files as you want by creating a directory
tree that is copied into the container’s filesystem, replacing any files that already exist. This happens
on container startup, before its main process is executed, so configuration changes from the
override are applied to the main process. This lets you manage file overrides without
modifying the service definition, making them much easier to maintain.

What’s more, `draky-entrypoint` lets you pass variables to overridden files via its templating system.
It can make overrides dynamic, based on variables.
You won’t need to think which file to modify each time you want to change something you often
change — just expose the right variable and manage them from a single file.

`draky-entrypoint` also provides a simple way to create a host user inside any container. Because this
is done dynamically at container startup, it doesn’t matter what ID the host user has—it will be
checked and applied automatically, which improves the reusability of configurations across different hosts.

`draky-entrypoint` also provides a generic way to run initialization scripts inside any container,
even those that do not provide this functionality out of the box, enabling further dynamic customization.