module.exports = {
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
        'template-curly-spacing': [2, 'always'],
        'no-restricted-syntax': 'off',
    },
}
