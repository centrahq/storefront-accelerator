import 'server-only';

import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core/typings';
import { cacheLife, cacheTag } from 'next/cache';

import { graphql } from '@gql/gql';
import {
  CategoriesQueryVariables,
  LookupCategoryMutationVariables,
  LookupProductMutationVariables,
  ProductsQueryVariables,
  RelatedProductsQueryVariables,
} from '@gql/graphql';

import { TAGS } from '../../constants';
import { CentraError } from '../../errors';
import { CentraResponse } from '../../types/api';

type BaseRequest = Omit<RequestInit, 'body' | 'method' | 'headers'> & {
  headers?: Record<string, string>;
};

/**
 * Fetches data from Centra Storefront API without session. Can be used on server side only.
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

/*
 * Retrieves product details based on URI.
 * Note: When multiple variants are activated for the same display,
 *       multiple displays with the same URI may be returned.
 *       In such cases, use the `displayItem` query with the item ID instead.
 */
export const lookupProduct = async (variables: LookupProductMutationVariables) => {
  'use cache: remote';

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
              ...productDetails
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

export const getRelatedProducts = async (variables: RelatedProductsQueryVariables) => {
  'use cache: remote';

  const result = await centraFetchNoSession(
    graphql(`
      query relatedProducts($id: Int!, $language: String!, $market: Int!, $pricelist: Int!) {
        displayItem(id: $id, languageCode: [$language], market: [$market], pricelist: [$pricelist]) {
          relatedDisplayItems(relationType: "standard") {
            relation
            displayItems {
              ...listProduct
            }
          }
        }
      }
    `),
    {
      variables,
    },
  );

  const relatedProducts =
    result.data.displayItem?.relatedDisplayItems.find(({ relation }) => relation === 'standard')?.displayItems ?? [];

  cacheTag(TAGS.product(variables.id));
  relatedProducts.forEach((product) => {
    cacheTag(TAGS.product(product.id));
  });
  cacheLife('hours');

  return relatedProducts;
};

export const filterProducts = async (variables: ProductsQueryVariables) => {
  const res = await centraFetchNoSession(
    graphql(`
      query products(
        $page: Int!
        $where: DisplayItemFilter
        $sort: [CustomSortInput!] = []
        $limit: Int = 40
        $market: Int!
        $pricelist: Int!
        $language: String!
        $withFilters: Boolean = true
      ) {
        displayItems(
          limit: $limit
          page: $page
          where: $where
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
            values {
              __typename
              value
              filterCount
              ... on BrandFilterValue {
                name
              }
              ... on CollectionFilterValue {
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
  'use cache: remote';

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
  'use cache: remote';

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
  'use cache: remote';

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
  'use cache: remote';

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
