---
sidebar_position: 3
---

# Creating a custom template

1. Initialize a new environment with the `draky env init` command.
2. Modify the content of the created `.draky` directory to fit your use case.
3. Edit the `.draky/template.dk.yml` file with your custom metadata. Choosing a new and unique id is obligatory.
4. Remove the `.draky/core.dk.yml` file.
5. Move content of the `.draky` directory from your project into `~/.draky/templates/[your-template-id]`.
6. Now when you will be initializing a new environment with the `draky env init` command, you will be able to choose a new template.
