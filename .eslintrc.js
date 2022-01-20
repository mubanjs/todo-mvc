module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './projects/**/tsconfig.json',
  },
  extends: ['@muban/eslint-config'],
  rules: {
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { packageDir: ['./', './projects/todo-app-client-vite'] },
    ],
  },
  ignorePatterns: ['.eslintrc.js'],
};
