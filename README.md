[![Build Status](https://travis-ci.com/tipeio/tipe-cli.svg?token=mE8qfws6qu8ishNcR5Zr&branch=master)](https://travis-ci.com/tipeio/tipe-cli)
# Tipe CLI
> Tipe in your command-line 
## Overview
This is 
# Commands
- `tipe login`: Login to your Tipe account(WIP)
- `tipe server`: Creates a local api based on your schema(WIP)
- [`tipe push`](docs/push.md): Pushes your local [Tipe Schema](https://github.com/tipeio/schema) to your [Dashboard](https://tipe.io) to create content
- [`tipe help`](docs/help.md): Display help for Tipe

# Getting Started
```
yarn add @tipe/cli

```


# Issues
# Development
```
yarn link
yarn install
```
### Create an Command
1. copy `src/examples/example.js` to `commands` folder
2. rename `example` to your command
3. Ensure tests
