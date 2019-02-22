# Setup and development

## Installation

```bash
# Install dependencies from package.json
npm install
```

## Dev server

```bash
# Launch the dev server
npm run dev
```

## Debugging (in Visual Studio Code)

Press the green play icon in the debugging pane

## Generators

This project includes generators to speed up common development tasks. Commands include:

```bash
# Generate a new dialog with adjacent unit test
npm run new dialog
```

Update existing or create new generators in the `_templates` folder, with help from the [Hygen docs](http://www.hygen.io/).

## Aliases

To simplify referencing local modules and refactoring, you can set aliases to be shared between dev and unit tests in `aliases.config.js`. As a convention, this project uses an `@` prefix to denote aliases.
