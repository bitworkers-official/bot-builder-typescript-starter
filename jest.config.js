module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(spec))\\.ts$',
  globals: {
    global: {}, // botframework needs the global variable
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
