export const TAGS = {
  products: 'products',
  productStatic: (id: string | number) => `product-static-${id}`,
  productDynamic: (id: string | number) => `product-dynamic-${id}`,
  languages: 'languages',
  markets: 'markets',
  pricelists: 'pricelists',
  categories: 'categories',
  category: (id: string | number) => `category-${id}`,
};
