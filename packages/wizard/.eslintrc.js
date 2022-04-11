module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte']
  },
  env: {
    es6: true,
    browser: true,
    "jest/globals": true
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-undef': 'off'
      }
    }
  ],
  settings: {
    'svelte3/typescript': require('typescript'),
    'svelte3/ignore-styles': () => true,
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  plugins: ['jest', 'svelte3', '@typescript-eslint'],
  ignorePatterns: ['node_modules']
}
