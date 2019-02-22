# Architecture

- [`_templates`](#_templates)
- [`.vscode`](#vscode)
- [`docs`](#docs)
- [`src`](#src)
  - [`dialogs`](#src-dialogs)
  - [`dialogs`](#src-types)
  - [`bot.ts`](#src-bot-ts)
  - [`server.ts`](#src-server-ts)
- [`tests`](#tests)

## `_templates`

Generator templates to speed up development. See [the development doc](development.md#generators) for more.

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code.

## `docs`

You found me! :wink:

## `src`

Where we keep all our source files.

### `src/dialogs`

Where we keep all our dialogs that are used by the bot.

### `src/types`

Where we keep all our custom types.

### `src/bot.ts`

Where we create the actual bot.

### `src/server.ts`

The entry point to our app, where we create our server which listens to requests.

## `tests`

Where all our tests go. See [the tests doc](tests.md) for more.
