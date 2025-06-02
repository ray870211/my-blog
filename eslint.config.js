const eslintPluginAstro = require('eslint-plugin-astro');
module.exports = [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'], // In CommonJS, the `flat/` prefix is required.
  {
    rules: {
      'no-console': 'warn'
    }
  }
];