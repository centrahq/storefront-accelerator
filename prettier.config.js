/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: true,
  quoteProps: 'consistent',
  printWidth: 120,
  tabWidth: 2,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@(gql)?/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderSideEffects: false,
  importOrderCaseInsensitive: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
};
