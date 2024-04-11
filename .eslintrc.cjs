module.exports = {
  env: {
    'react-native/react-native': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-native/all',
    'plugin:perfectionist/recommended-natural',
  ],
  overrides: [
    {
      extends: ['plugin:markdown/recommended'],
      files: ['**/*.md'],
      processor: 'markdown/markdown',
    },
    {
      // Exclude files ESLint uses for ```{ts,tsx} fenced code blocks inside .md files.
      // https://github.com/eslint/eslint-plugin-markdown#advanced-configuration
      excludedFiles: ['**/*.md/*.{ts,tsx}'],
      extends: [
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:deprecation/recommended',
      ],
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: {
              arguments: false,
            },
          },
        ],
      },
    },
    {
      excludedFiles: ['package.json'],
      extends: ['plugin:jsonc/recommended-with-json'],
      files: ['*.json', '*.jsonc'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/comma-dangle': 'off',
        'jsonc/sort-keys': 'error',
      },
    },
    {
      files: ['*.jsonc'],
      rules: {
        'jsonc/no-comments': 'off',
      },
    },
    {
      extends: ['plugin:package-json/recommended'],
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      plugins: ['package-json'],
    },
    {
      files: '**/*.test.{ts,tsx}',
      rules: {
        // These on-by-default rules aren't useful in test files.
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@stylistic',
    '@typescript-eslint',
    'react',
    'react-native',
    'react-hooks',
    'simple-import-sort',
    'import',
    'perfectionist',
  ],
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { fixStyle: 'inline-type-imports' },
    ],
    '@typescript-eslint/no-empty-function': [
      'error',
      { allow: ['arrowFunctions'] },
    ],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/sort-type-constituents': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-shadow': 'off',
    'perfectionist/sort-imports': 'off', // Already done by simple-import-sort.
    'perfectionist/sort-named-exports': 'off', // Already done by simple-import-sort.
    'perfectionist/sort-named-imports': 'off', // Already done by simple-import-sort.
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        'partition-by-comment': true,
        type: 'natural',
      },
    ],
    'perfectionist/sort-union-types': 'off', // Already done by @typescript-eslint/sort-type-constituents.
    'prefer-arrow-callback': ['error', { allowUnboundThis: false }],
    'prefer-exponentiation-operator': 'error',
    'prefer-named-capture-group': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-object-has-own': 'error',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-pascal-case': 'error',
    'react/no-multi-comp': ['error', { ignoreStateless: true }],
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-native/no-raw-text': ['error', { skip: ['Trans', 'Title'] }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // `react` related packages.
          ['^react'],
          // Other external packages.
          ['^@?\\w'],
          // TS path imports.
          ['^~\\w'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'sort-imports': 'off', // Already done by simple-import-sort.
    'sort-vars': 'error',
    /*
      Stylistic concerns that don't interfere with Prettier.
      Ideally these should not be part of the linter but the formatter instead,
      however an equivalent plugin is not available for Prettier at the moment.
    */
    '@stylistic/padding-line-between-statements': [
      'error',
      // New line after var declaration.
      { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
      {
        blankLine: 'any',
        next: ['const', 'let', 'var'],
        prev: ['const', 'let', 'var'],
      },
      // New line before return.
      { blankLine: 'always', next: 'return', prev: '*' },
      // New line after block.
      { blankLine: 'always', next: '*', prev: 'block-like' },
    ],
    '@stylistic/spaced-comment': 'error',
    curly: 'error',
    /*
      The following rules are deprecated and not present in eslint:recommended.
      However they still exist in @typescript-eslint in version 6
      (see https://typescript-eslint.io/blog/deprecating-formatting-rules/)
      and therefore need to be manually disabled until version 7 is published
      and these rules are removed from @typescript-eslint.
      When this happens, these rules can safely be removed from this file.
    */
    'block-spacing': 'off',
    'brace-style': 'off',
    'comma-dangle': 'off',
    indent: 'off',
    'key-spacing': 'off',
    'keyword-spacing': 'off',
    'lines-around-comment': 'off',
    'lines-between-class-members': 'off',
    'no-extra-parens': 'off',
    'no-extra-semi': 'off',
    quotes: 'off',
    semi: 'off',
    'space-before-blocks': 'off',
    'space-infix-ops': 'off',
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
