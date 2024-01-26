---
sidebar_position: 3
---

# Templates

## Introduction

Template is basically a `docker-compose.yml` file with its configuration, and anything that can be
consumed by the services, that can be used to set up a project.

The default empty template is always available, but you can also prepare custom templates. Custom
templates are pulled from the `~/.draky/templates/` directory.

When you run `draky env init` in your project's root directory, draky will ask you to select a
template, or if there are no custom templates in the `~/.draky/templates/` directory, the empty one
will be automatically used.

After template is selected, draky will simply copy its content into the `[project's root]/.draky/`
directory, and add there a `core.dk.yml` file with some project-related information. That's all.

Templates are not meant to be unchanged when they land in a project as its environment
configuration. You are supposed to tweak them to fit this specific project. When the
`[project's root]/env/dev/docker-compose.yml` is good, you can run `draky env up` to start
the environment.

To create your own template, see: [Creating a custom template](/docs/tutorials/create-custom-template)

## Installation

To install templates, simply download or prepare them yourself, and put them in the `~/.draky/templates/` directory.

## Example templates

The following examples can be customized, and put directly in your project, or installed as templates,
to be easily reused later.

If you opt to not install these configurations as templates, and just want to use them directly, you
can just copy their files to your project's `.draky/` directory, and add the `core.dk.yml` file with the
following content:

```yaml
variables:
    DRAKY_PROJECT_ID: example-project
    DRAKY_ENVIRONMENT: dev
```

Remember to change the `example-project` to the unique id.

Always download the latest release. The packaged release is guaranteed to contain all dependencies.

### PHP web application

This is an example of configuration for a PHP web application, like Symfony or Drupal project.

https://github.com/draky-dev/template-draky-php-webapp