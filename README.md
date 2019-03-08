# Tipe CLI
![Tipe logo](https://cdn.tipe.io/tipe/tipe-cat-no-text.svg)

[![Build Status](https://travis-ci.com/tipeio/tipe-cli.svg?token=mE8qfws6qu8ishNcR5Zr&branch=master)](https://travis-ci.com/tipeio/tipe-cli)

## Overview
The Tipe CLI is used to manage your Tipe Schemas  from the command line. It is built using [oclif](https://oclif.io/). <br>
yarn add @tipe/cli <br>
npm install @tipe/cli
# Commands
- `tipe login`: Login to your Tipe account(WIP)
- `tipe server`: Creates a local api based on your schema(WIP)
- [`tipe push`](docs/push.md): Pushes your local [Tipe Schema](https://github.com/tipeio/schema) to your [Dashboard](https://tipe.io) to create content
- [`tipe help`](docs/help.md): Display help for Tipe

# Issues
For problems directly related to the CLI, [add an issue on GitHub.](https://github.com/tipeio/tipe-cli/issues)

For other issues, [submit a support ticket.](https://tipe.io)
# Developing
```
yarn link
yarn install
```
The core plugins are located in [./src/commands](./src/commands)

To cut a release, commit you messages using our [commit guide](https://github.com/tipeio/tipe-conventions/blob/4987a13f29bc7e5fcbb428dd7b245fedcd5bf6ce/COMMIT_CONVENTION.md#git-commit-message-convention)
