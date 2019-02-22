module.exports = {
  '*.ts': [
    'eslint --fix',
    'prettier --write',
    'git add',
    'jest --bail --findRelatedTests',
  ],
  '{!(package)*.json,*.code-snippets,.*rc}': [
    'npx prettier --parser json',
    'git add',
  ],
  'package.json': ['npx prettier --parser json', 'git add'],
}
