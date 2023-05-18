module.exports = {
  '@angular-eslint/directive-selector': [
    'error',
    {
      type: 'attribute',
      prefix: 'app',
      style: 'camelCase'
    }
  ],
  '@angular-eslint/component-selector': [
    'error',
    {
      type: 'element',
      prefix: 'app',
      style: 'kebab-case'
    }
  ],
  '@angular-eslint/component-class-suffix': [
    'error',
    {
      suffixes: ['Component', 'Layout', 'Page']
    }
  ]
};
