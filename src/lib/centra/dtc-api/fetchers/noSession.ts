import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core/typings';
import 'server-only';

import { graphql } from '@gql/gql';
import {
  CategoriesQueryVariables,
  CategoryDetailsQueryVariables,
  ProductAvailabilityQueryVariables,
  ProductDetailsQueryVariables,
  ProductsQueryVariables,
} from '@gql/graphql';

import { TAGS } from '../../constants';
import { CentraError } from '../../errors';
import { GQLResponse } from '../../types/api';

type BaseRequest = Omit<RequestInit, 'body' | 'method' | 'headers'> & {
  headers?: Record<string, string>;
};

type Options<T> = BaseRequest &
  (VariablesOf<T> extends { [key: string]: never } ? { variables?: VariablesOf<T> } : { variables: VariablesOf<T> });

/**
 * Fetches data from Centra DTC API without session. Can be used on server side only.
 * Use `graphql` function to get type safety.
 *
 * @example
 * centraFetchNoSession(
 *   graphql(`
 *     query product($id: Int!, $language: String!) {
 *       displayItem(id: $id, languageCode: [$language]) {
 *         id
 *       }
 *     }
 *   `),
 *   {
 *     variables: {
 *       id: 1,
 *       language: 'en',
 *     },
 *     next: {
 *       tags: [`product-${variables.id}`],
 *       revalidate: 30 * 24 * 60 * 60,
 *     },
 *   },
 * )
 */
export async function centraFetchNoSession<T>(query: T, options: Options<T>) {
  const { headers, variables, ...rest } = options;

  const result = await fetch(process.env.NO_SESSION_GQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NO_SESSION_GQL_AUTHORIZATION}`,
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    ...rest,
  });

  const body = (await result.json()) as GQLResponse<ResultOf<T>>;

  if ('errors' in body) {
    throw new CentraError(body.errors, body.extensions?.traceId);
  }

  return body;
}

/*
 Fetcher for product details that can be obtained without session data (market, pricelist).
 Can be used to pre-render or statically generate product pages.
*/
export const getProductDetails = async (variables: ProductDetailsQueryVariables) => {
  try {
    const res = await centraFetchNoSession(
      graphql(`
        query productDetails($id: Int!) {
          displayItem(id: $id) {
            id
            bundle {
              type
              priceType
              minPriceByPricelist {
                pricelist {
                  id
                }
                priceByMarket {
                  markets
                  price {
                    formattedValue
                  }
                }
              }
              maxPriceByPricelist {
                pricelist {
                  id
                }
                priceByMarket {
                  markets
                  price {
                    formattedValue
                  }
                }
              }
              sections {
                id
                quantity
                items {
                  id
                  name
                  media {
                    source(sizeName: "standard") {
                      url
                    }
                  }
                  priceByPricelist {
                    pricelist {
                      id
                    }
                    priceByMarket {
                      markets
                      price {
                        formattedValue
                        value
                        currency {
                          code
                        }
                      }
                    }
                  }
                  items {
                    ...item
                  }
                  translations {
                    language {
                      code
                    }
                    name
                  }
                }
              }
            }
            media {
              source(sizeName: "full") {
                url
              }
            }
            priceByPricelist {
              pricelist {
                id
              }
              priceByMarket {
                markets
                price {
                  formattedValue
                  value
                  currency {
                    code
                  }
                }
              }
            }
            items {
              ...item
            }
            translations {
              language {
                code
              }
              uri
              name
              metaTitle
              metaDescription
              description {
                formatted
              }
            }
          }
        }
      `),
      {
        variables,
        next: {
          tags: [TAGS.productStatic(variables.id)],
          revalidate: 30 * 24 * 60 * 60,
        },
      },
    );

    return res.data.displayItem;
  } catch {
    return null;
  }
};

/*
  Fetcher for product and item availability which can only be obtained with session data (market, pricelist).
  Should be used within a Suspense boundary.
*/
export const getProductAvailability = async (variables: ProductAvailabilityQueryVariables) => {
  try {
    const res = await centraFetchNoSession(
      graphql(`
        query productAvailability($id: Int!, $market: [Int!]!, $pricelist: [Int!]!) {
          displayItem(id: $id, market: $market, pricelist: $pricelist) {
            available
            items {
              id
              stock {
                available
              }
            }
            bundle {
              sections {
                id
                items {
                  id
                  items {
                    id
                    stock {
                      available
                    }
                  }
                }
              }
            }
          }
        }
      `),
      {
        variables,
        next: {
          tags: [TAGS.productDynamic(variables.id)],
          revalidate: 24 * 60 * 60,
        },
      },
    );
    return res.data.displayItem;
  } catch {
    return null;
  }
};

export const filterProducts = async (variables: ProductsQueryVariables) => {
  const res = await centraFetchNoSession(
    /* TODO: Remove category from filter query when https://centracommerce.atlassian.net/browse/DT-866 is resolved */
    graphql(`
      query products(
        $page: Int!
        $search: String
        $sort: [CustomSortInput!] = []
        $filters: [FilterInput!] = []
        $limit: Int = 40
        $market: Int!
        $pricelist: Int!
        $language: String!
        $withFilters: Boolean = true
      ) {
        displayItems(
          limit: $limit
          page: $page
          where: { search: $search, filters: $filters }
          sort: $sort
          market: [$market]
          pricelist: [$pricelist]
          languageCode: [$language]
        ) {
          list {
            id
            uri
            name
            media {
              source(sizeName: "standard") {
                url
              }
            }
            price {
              formattedValue
            }
            bundle {
              type
              priceType
              minPrice {
                formattedValue
              }
            }
          }
          pagination {
            currentPage
            lastPage
          }
          filters @include(if: $withFilters) {
            key
            anyAvailable
            selectedValues
            values {
              __typename
              value
              filterCount
              ... on BrandFilterValue {
                name
              }
              ... on CategoryFilterValue {
                category {
                  id
                }
              }
            }
          }
        }
      }
    `),
    {
      variables,
      next:
        variables.withFilters === false
          ? {
              tags: [TAGS.products],
              revalidate: 24 * 60 * 60,
            }
          : {},
    },
  );

  return res.data.displayItems;
};

export const getCountriesAndLanguages = async () => {
  const response = await centraFetchNoSession(
    graphql(`
      query countriesAndLanguages {
        countries(onlyShipTo: true) {
          name
          code
          defaultLanguage {
            code
            languageCode
          }
          translations {
            language {
              code
            }
            name
          }
        }
        languages {
          languageCode
          name
          code
          countryCode
        }
      }
    `),
    {
      next: {
        tags: [TAGS.languages],
        revalidate: 30 * 24 * 60 * 60,
      },
    },
  );

  return response.data;
};

export const getCountriesWithStates = async () => {
  const response = await centraFetchNoSession(
    graphql(`
      query countries {
        countries(onlyShipTo: true) {
          name
          code
          states {
            name
            code
          }
          translations {
            language {
              code
            }
            name
          }
        }
      }
    `),
    {
      next: {
        revalidate: 30 * 24 * 60 * 60,
      },
    },
  );

  return response.data.countries;
};

export const getRootCategories = async (variables: CategoriesQueryVariables) => {
  const response = await centraFetchNoSession(
    graphql(`
      query categories($limit: Int!) {
        categories(limit: $limit, parent: 0) {
          list {
            id
            translations {
              name
              uri
              language {
                code
              }
            }
          }
        }
      }
    `),
    {
      next: {
        tags: [TAGS.categories],
        revalidate: 30 * 24 * 60 * 60,
      },
      variables,
    },
  );

  return response.data.categories?.list ?? [];
};

export const getCategoryDetails = async (variables: CategoryDetailsQueryVariables) => {
  try {
    const response = await centraFetchNoSession(
      graphql(`
        query categoryDetails($id: Int!) {
          categories(id: [$id], limit: 1) {
            list {
              id
              translations {
                uri
                language {
                  code
                }
                name
                metaTitle
                metaDescription
              }
            }
          }
        }
      `),
      {
        next: {
          tags: [TAGS.category(variables.id)],
          revalidate: 30 * 24 * 60 * 60,
        },
        variables,
      },
    );

    return response.data.categories?.list[0];
  } catch {
    return null;
  }
};
