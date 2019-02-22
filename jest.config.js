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
  moduleNameMapper: { '@/(.*)': '<rootDir>/src/$1' },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
