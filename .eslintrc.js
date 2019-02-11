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
}
