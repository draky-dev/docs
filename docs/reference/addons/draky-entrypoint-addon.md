---
sidebar_position: 3
---

# draky-entrypoint addon

## Introduction
draky-entrypoint is an addon that can provide your services with a special entrypoint. It doesn't disable the image's
existing entrypoint: it runs its custom entrypoint first and then executes the original entrypoint and the main command.

The following features will work as long as the addon is installed and enabled for the given service.

Resources can be passed to the `draky-entrypoint` through the `/draky-entrypoint.resources` volume. E.g.:
```yaml
  volumes:
    - "./resources:/draky-entrypoint.resources:cached,ro"
```

## Run custom initialization scripts
Scripts inside the container's `/draky-entrypoint.resources/init.d` directory will run each time the container
is started.

## Override any files inside the container

You can override many files inside the container in a cleaner way than adding many volumes.

All files and directories inside the `/draky-entrypoint.resources/override` will be recursively
copied into the container's root.

If the contents of the `/draky-entrypoint.resources/override` directory are:

```
/draky-entrypoint.resources/override/etc/php/php.ini
/draky-entrypoint.resources/override/etc/nginx/conf.d/mywebsite.conf
```

These files will be merged into the container's directory tree each time the container starts.

That way you can customize your containers per-project without having to produce new images.

### Variables in the overriding files

The entrypoint provides a way for substituting variables inside the files in the `override` directory.

It means that when overriding the container's file, you may use a template with variables, e.g.:

```
; Unix user/group of processes
; Note: The user is mandatory. If the group is not set, the default user's group
;       will be used.
user = ${DRAKY_OVERRIDE_HOST_USERNAME}
group = ${DRAKY_OVERRIDE_HOST_GROUP}
```

In this case, you also need to pass these variables into the container by declaring them in the service definition:

```yaml
environment:
  DRAKY_OVERRIDE_HOST_USERNAME: host
  DRAKY_OVERRIDE_HOST_GROUP: host
```

Note that the variables available in the overriding files are **only** variables prefixed with the `DRAKY_OVERRIDE_`
string.

Note also that because you can use variables from your [configuration files](/docs/reference/configuration-files) in the service definitions,
you can pass them into the container and use them in your files in the `override` directory. That way, to some degree,
you can configure files inside your container with configuration files on the host.

## Environment variables

You can pass some optional environment variables to the container that is using `draky-entrypoint` to alter its behavior.

`DRAKY_ENTRYPOINT_DO_CREATE_HOST_USER` - if this variable has a value, the `draky-entrypoint` will create a user with the name `host`,
with the same ID as the value of this variable. Why would you want to use it? For example, if you want to run something inside the
container as the host user. That way you will have access to the files created by this process. A common use case would be `php-fpm`.