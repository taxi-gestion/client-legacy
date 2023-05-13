// Do not move / rename this file, it works for IDE automatic setting.
// Lint the files included in each typescript project with common rules
const projects = ['./tsconfig.json'];

// Lint project using its tsconfig.json.
const lintProjects = () => {
  return [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier'
      ],
      env: {
        node: true
      },
      files: ['**/*.ts', '**/*.tsx'],
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
        ...require('./.eslint-rules/typescript-eslint.rules.cjs')
      }
    }
  ];
};

module.exports = {
  root: true,
  overrides: [...lintProjects()]
};
