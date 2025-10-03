export const TAGS = {
  products: 'products',
  product: (id: string | number) => `product-${id}`,
  languages: 'languages',
  markets: 'markets',
  countries: 'countries',
  categories: 'categories',
  category: (id: string | number) => `category-${id}`,
};

export const enum FilterKey {
  Brands = 'brands',
  Sizes = 'itemName',
  Collections = 'collections',
  Categories = 'categories',
}
