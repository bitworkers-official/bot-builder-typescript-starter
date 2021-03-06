module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '/src/.*\\.unit\\.ts$', // all files in the tests folder that end with .unit.ts
  globals: {
    global: {}, // botframework needs the global variable
  },
  moduleNameMapper: { '@/(.*)': '<rootDir>/src/$1' },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}
