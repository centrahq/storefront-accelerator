import 'server-only';

import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core/typings';
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

import { graphql } from '@gql/gql';
import {
  CategoriesQueryVariables,
  LookupCategoryMutationVariables,
  LookupProductMutationVariables,
  LookupRelatedProductsMutationVariables,
  ProductsQueryVariables,
} from '@gql/graphql';

import { TAGS } from '../../constants';
import { CentraError } from '../../errors';
import { CentraResponse } from '../../types/api';

type BaseRequest = Omit<RequestInit, 'body' | 'method' | 'headers'> & {
  headers?: Record<string, string>;
};

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
 *   },
 * )
 */
export async function centraFetchNoSession<T>(
  query: T,
  ...options: VariablesOf<T> extends { [key: string]: never }
    ? [options?: BaseRequest & { variables?: VariablesOf<T> }]
    : [options: BaseRequest & { variables: VariablesOf<T> }]
) {
  const { headers, variables, ...rest } = options[0] ?? {};

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

  const body = (await result.json()) as CentraResponse<ResultOf<T>>;

  if ('errors' in body) {
    throw new CentraError(body.errors, body.extensions?.traceId);
  }

  return body;
}

export const lookupProduct = async (variables: LookupProductMutationVariables) => {
  'use cache';

  const result = await centraFetchNoSession(
    graphql(`
      mutation lookupProduct($uri: String!, $language: String!, $market: Int!, $pricelist: Int!) {
        lookupUri(
          uri: $uri
          for: [DISPLAY_ITEM]
          languageCode: [$language]
          market: [$market]
          pricelist: [$pricelist]
        ) {
          __typename
          ... on DisplayItemUriLookupPayload {
            displayItem {
              id
              available
              uri
              name
              metaTitle
              metaDescription
              description {
                formatted
              }
              media {
                id
                altText
                source(sizeName: "1350x0") {
                  url
                }
              }
              price {
                formattedValue
                value
                currency {
                  code
                }
              }
              items {
                ...item
                stock {
                  available
                }
              }
              relatedDisplayItems(relationType: "variant") {
                relation
                displayItems {
                  uri
                  productVariant {
                    name
                  }
                  ...variantSwatch
                }
              }
              productVariant {
                name
              }
              ...variantSwatch
              translations {
                language {
                  code
                }
                uri
              }
              bundle {
                ...bundle
              }
            }
          }
        }
      }
    `),
    {
      variables,
    },
  );

  if (result.data.lookupUri?.__typename !== 'DisplayItemUriLookupPayload') {
    throw new Error('Product not found');
  }

  cacheTag(TAGS.product(result.data.lookupUri.displayItem.id));
  cacheLife('hours');

  return result.data.lookupUri.displayItem;
};

export const getRelatedProducts = async (variables: LookupRelatedProductsMutationVariables) => {
  'use cache';

  const result = await centraFetchNoSession(
    graphql(`
      mutation lookupRelatedProducts($uri: String!, $language: String!, $market: Int!, $pricelist: Int!) {
        lookupUri(
          uri: $uri
          for: [DISPLAY_ITEM]
          languageCode: [$language]
          market: [$market]
          pricelist: [$pricelist]
        ) {
          __typename
          ... on DisplayItemUriLookupPayload {
            displayItem {
              relatedDisplayItems(relationType: "standard") {
                relation
                displayItems {
                  ...listProduct
                }
              }
            }
          }
        }
      }
    `),
    {
      variables,
    },
  );

  if (result.data.lookupUri?.__typename !== 'DisplayItemUriLookupPayload') {
    throw new Error('Product not found');
  }

  cacheTag(TAGS.products);
  cacheLife('hours');

  return (
    result.data.lookupUri.displayItem.relatedDisplayItems.find(({ relation }) => relation === 'standard')
      ?.displayItems ?? []
  );
};

export const filterProducts = async (variables: ProductsQueryVariables) => {
  const res = await centraFetchNoSession(
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
            ...listProduct
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
            }
          }
        }
      }
    `),
    {
      variables,
    },
  );

  return res.data.displayItems;
};

export const getCountries = async () => {
  'use cache';

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
      }
    `),
  );

  cacheTag(TAGS.countries, TAGS.markets);
  cacheLife('days');

  return response.data.countries;
};

export const getLanguages = async () => {
  'use cache';

  const response = await centraFetchNoSession(
    graphql(`
      query languages {
        languages {
          languageCode
          name
          code
          countryCode
        }
      }
    `),
  );

  cacheTag(TAGS.languages);
  cacheLife('days');

  return response.data.languages;
};

export const getRootCategories = async (variables: CategoriesQueryVariables) => {
  'use cache';

  cacheTag(TAGS.categories);
  cacheLife('days');

  const response = await centraFetchNoSession(
    graphql(`
      query categories($limit: Int!, $language: String!, $market: Int!) {
        categories(limit: $limit, parent: 0, languageCode: [$language], market: [$market]) {
          list {
            name
            uri
          }
        }
      }
    `),
    {
      variables,
    },
  );

  return response.data.categories?.list ?? [];
};

export const lookupCategory = async (variables: LookupCategoryMutationVariables) => {
  'use cache';

  const result = await centraFetchNoSession(
    graphql(`
      mutation lookupCategory($uri: String!, $language: String!, $market: Int!) {
        lookupUri(uri: $uri, for: [CATEGORY], languageCode: [$language], market: [$market]) {
          __typename
          ... on CategoryUriLookupPayload {
            category {
              id
              uri
              name
              metaTitle
              metaDescription
              childCategories {
                name
                uri
              }
              translations {
                uri
                language {
                  code
                }
              }
            }
          }
        }
      }
    `),
    {
      variables,
    },
  );

  if (result.data.lookupUri?.__typename !== 'CategoryUriLookupPayload') {
    throw new Error('Category not found');
  }

  cacheTag(TAGS.category(result.data.lookupUri.category.id));
  cacheLife('days');

  return result.data.lookupUri.category;
};
