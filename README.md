# Tipe CLI

![Tipe logo](https://cdn.tipe.io/tipe/tipe-cat-no-text.svg)
[![Build Status](https://travis-ci.com/tipeio/tipe-cli.svg?token=mE8qfws6qu8ishNcR5Zr&branch=master)](https://travis-ci.com/tipeio/tipe-cli)

> Tool to interact with [Tipe](https://tipe.io)

## Overview

The Tipe CLI is used to manage your Tipe Schemas from the command line. It is built using [oclif](https://oclif.io/). 
Check out our [`Getting Started Guide`](docs/getting-started.md) and [`API Reference`](docs/api.md)
<br>
```sh
yarn add @tipe/cli 
```
```sh
npm install @tipe/cli
```
# Commands

- [`tipe push`](docs/push.md): Pushes your local [Tipe Schema](https://github.com/tipeio/schema) to your [Dashboard](https://tipe.io) to create content
- [`tipe serve`](docs/serve.md): Starts an offline local API that serves mock content based on your [Tipe Schema](https://github.com/tipeio/schema)
<!-- - [`tipe new`](docs/new.md): Scaffold a new basic schema for your project [Tipe Schema](https://github.com/tipeio/schema) -->
<!-- - [`tipe help`](docs/help.md): Display help for Tipe -->

# Issues

For problems directly related to the CLI, [add an issue on GitHub.](https://github.com/tipeio/tipe-cli/issues)

# Developing

```
yarn install
yarn link
```

The core plugins are located in [./src/actions](./src/actions)

To cut a release, commit you messages using our [commit guide](https://github.com/tipeio/tipe-conventions/blob/4987a13f29bc7e5fcbb428dd7b245fedcd5bf6ce/COMMIT_CONVENTION.md#git-commit-message-convention)
