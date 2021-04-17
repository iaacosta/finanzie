module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'jest'],
  env: { browser: true, es6: true, jest: true },
  globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  ignorePatterns: ['src/@types/graphql.ts'],
  rules: {
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'jest/expect-expect': 'off',
    'react/require-default-props': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-template-curly-in-string': 'off',
  },
};
