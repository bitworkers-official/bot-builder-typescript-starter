# Tests

## Running all tests

```bash
 # Run all tests
npm run test

# Run all the tests every time a file changes
npm run test:watch
```

## Unit test files

Configuration for Jest is in `jest.config.js`, support files are in `tests`, but as for the tests themselves - they're first-class citizens. That means they live alongside our source files, using the same name as the file they test, but with the extension `.unit.ts`.
