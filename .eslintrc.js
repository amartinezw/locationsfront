module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  globals: {
    fetch: false,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-shadow': 'off',
    'max-len': ['error', { code: 120 }],
  },
};
