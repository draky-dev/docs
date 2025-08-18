---
sidebar_position: 2
---

# Configuration files

## Specification

Any file that ends with `dk.yml` is considered a **configuration file**. Configuration files can be placed anywhere
inside the project's `.draky` directory.

They can have the following values:
- `id` –> `str, optional`: Unique ID allowing identification of the configuration file. If not present, then the path
to the file becomes its ID.
- `variables` –> `dict<str,str>, optional`: A dictionary containing variables that are declared by this configuration
  file. Variables from all configuration files will be merged to produce the `.env` file. This file contains all
  variables and is picked up by the docker-compose, making them available in the `docker-compose.yml` file.
  - These variables can be used in the `docker-compose.yml` file.
  - They are also available inside the commands. **Even the ones that are executed inside the containers**. Thanks to
    them, you can be very flexible with configuring your environment.
  - They can reference themselves:

    ```yaml
    variables:
      FIRST_VARIABLE: first
      SECOND_VARIABLE: "${FIRST_VARIABLE} second"
    ```
    You can reference variables even across multiple configuration files. However, the correct loading order of files
    needs to be ensured. You can ensure it by using the `dependencies` key.
- `dependencies` –> `list<str>, optional`: It allows you to define the relationships between configuration files. If
  you reference a variable from a different file, and need to ensure that this file will be loaded before yours, so the
  variable will be available, then you can reference this configuration file here by its `id`.
- `version` –> `str, optional`: Configuration files can also have a versioning information.

An [addon](/docs/reference/addons/about) is a special type of configuration file.

It does everything that normal configuration files do, but additionally it indicates the addon's
location.

## Example

```yaml
id: php-config
variables:
  PHP_IMAGE_VERSION: 8.2.11
  PHP_IMAGE: "php:${PHP_IMAGE_VERSION}-fpm" # Now we can use this variable to choose the service's image.
```
