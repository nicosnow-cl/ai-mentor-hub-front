module.exports = {
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.js',
  tailwindStylesheet: './src/app/globals.scss',
}
