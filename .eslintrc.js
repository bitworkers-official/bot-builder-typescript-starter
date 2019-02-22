module.exports = {
  root: true,
  extends: 'bitworkers',

  rules: {
    'space-before-function-paren': [
      2,
      {
        named: 'never',
        anonymous: 'never',
        asyncArrow: 'always',
      },
    ],
    'no-restricted-syntax': 'off',
  },
  overrides: [
    {
      files: '**/*.unit.ts',
      env: { jest: true },
      plugins: ['jest'],
      // extends: ['plugin:jest/recommended'],
    },
  ],
}
