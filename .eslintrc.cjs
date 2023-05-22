// Do not move / rename this file, it works for IDE automatic setting.
// Lint the files included in each typescript project with common rules
const projects = ['./tsconfig.app.json'];
const tests = ['./tsconfig.spec.json'];

// Lint project using its tsconfig.json.
const lintProjects = () => {
  return [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates'
      ],
      env: {
        node: true,
        browser: true
      },
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: projects,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint'],
      rules: {
        ...require('./.eslint-rules/eslint.rules.cjs'),
        ...require('./.eslint-rules/typescript-eslint.rules.cjs'),
        ...require('./.eslint-rules/angular.rules.cjs')
      }
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {}
    }
    //{
    //  "files": ["*.html"],
    //  "excludedFiles": ["*inline-template-*.component.html"],
    //  "extends": ["plugin:prettier/recommended"],
    //  "rules": {
    //    "prettier/prettier": ["error", { "parser": "angular" }]
    //  }
    //}
  ];
};

const lintTests = () => {
  return [
    {
      env: {
        'jest/globals': true
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: tests,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      files: ['src/**/*.spec.ts'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      plugins: ['jest', '@typescript-eslint'],
      rules: {
        ...require('./.eslint-rules/eslint.rules.cjs'),
        ...require('./.eslint-rules/eslint.test.rules.cjs'),
        ...require('./.eslint-rules/typescript-eslint.rules.cjs'),
        ...require('./.eslint-rules/typescript-eslint.test.rules.cjs'),
        ...require('./.eslint-rules/jest.rules.cjs')
      }
    }
  ];
};

module.exports = {
  root: true,
  overrides: [...lintProjects(), ...lintTests()]
};
