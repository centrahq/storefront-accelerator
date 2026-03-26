'use server';

import z from 'zod';

import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';
import { BundleSectionInput } from '@gql/graphql';

import {
  EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
  EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME,
  MAX_EMBROIDERY_TEXT_LENGTH,
} from '../product-customization/embroidery/constants';

export const addItemToCart = async ({
  item,
  quantity = 1,
  subscriptionPlan = null,
  customizations = {},
}: {
  item: string;
  quantity?: number;
  subscriptionPlan?: number | null;
  customizations?: { embroideryText?: string };
}) => {
  const validatedEmbroideryText = z
    .string()
    .max(MAX_EMBROIDERY_TEXT_LENGTH)
    .optional()
    .safeParse(customizations.embroideryText);

  if (!validatedEmbroideryText.success) {
    throw new Error('Invalid embroidery text');
  }

  const embroideryText = validatedEmbroideryText.data;

  return centraFetch(
    graphql(`
      mutation addItem(
        $item: String!
        $quantity: Int = 1
        $subscriptionPlan: Int
        $dynamicAttributes: [DynamicLineAttributeSetInput!]
      ) {
        addItem(
          item: $item
          quantity: $quantity
          subscriptionPlan: $subscriptionPlan
          dynamicAttributes: $dynamicAttributes
        ) {
          userErrors {
            message
            path
          }
          selection {
            ...cart
          }
        }
      }
    `),
    {
      headers: {
        'X-SHARED-SECRET': process.env.GQL_SHARED_SECRET,
      },
      variables: {
        item,
        quantity,
        subscriptionPlan,
        dynamicAttributes: [
          embroideryText
            ? {
                attributeTypeName: EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME,
                attributeElementKey: EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
                attributeElementValue: embroideryText,
              }
            : null,
        ].filter((attr) => !!attr),
      },
    },
  );
};

export const addFlexibleBundleToCart = async ({
  item,
  sections,
  quantity = 1,
  subscriptionPlan = null,
  customizations = {},
}: {
  item: string;
  sections: BundleSectionInput[];
  quantity?: number;
  subscriptionPlan?: number | null;
  customizations?: { embroideryText?: string };
}) => {
  const validatedEmbroideryText = z
    .string()
    .max(MAX_EMBROIDERY_TEXT_LENGTH)
    .optional()
    .safeParse(customizations.embroideryText);

  if (!validatedEmbroideryText.success) {
    throw new Error('Invalid embroidery text');
  }

  const embroideryText = validatedEmbroideryText.data;

  return centraFetch(
    graphql(`
      mutation addFlexibleBundleToCart(
        $item: String!
        $sections: [BundleSectionInput!]!
        $quantity: Int = 1
        $subscriptionPlan: Int
        $dynamicAttributes: [DynamicLineAttributeSetInput!]
      ) {
        addFlexibleBundle(
          item: $item
          quantity: $quantity
          sections: $sections
          subscriptionPlan: $subscriptionPlan
          dynamicAttributes: $dynamicAttributes
        ) {
          userErrors {
            message
            path
          }
          selection {
            ...cart
          }
        }
      }
    `),
    {
      headers: {
        'X-SHARED-SECRET': process.env.GQL_SHARED_SECRET,
      },
      variables: {
        item,
        sections,
        quantity,
        subscriptionPlan,
        dynamicAttributes: [
          embroideryText
            ? {
                attributeTypeName: EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME,
                attributeElementKey: EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
                attributeElementValue: embroideryText,
              }
            : null,
        ].filter((attr) => !!attr),
      },
    },
  );
};
