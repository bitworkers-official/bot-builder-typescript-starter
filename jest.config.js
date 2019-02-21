module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.spec\\.ts$', // all files in the tests folder that end with .spec.ts
  globals: {
    global: {}, // botframework needs the global variable
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
