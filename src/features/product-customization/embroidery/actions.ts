'use server';

import z from 'zod';

import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';

import {
  EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
  EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME,
  MAX_EMBROIDERY_TEXT_LENGTH,
} from './constants';

export const addEmbroideryToLine = async (
  {
    lineId,
    text,
  }: {
    lineId: string;
    text: string;
  },
  inCheckout = false,
) => {
  const validatedEmbroideryText = z.string().max(MAX_EMBROIDERY_TEXT_LENGTH).safeParse(text);

  if (!validatedEmbroideryText.success) {
    throw new Error('Invalid embroidery text');
  }

  const embroideryText = validatedEmbroideryText.data;

  return centraFetch(
    graphql(`
      mutation addEmbroideryToLine(
        $lineId: String!
        $dynamicAttributes: [DynamicLineAttributeSetInput!]!
        $inCheckout: Boolean!
      ) {
        setLineAttributes(lineId: $lineId, dynamicAttributes: $dynamicAttributes) {
          userErrors {
            message
            path
          }
          selection {
            ...checkout @include(if: $inCheckout)
            ...cart @skip(if: $inCheckout)
          }
        }
      }
    `),
    {
      headers: {
        'X-SHARED-SECRET': process.env.GQL_SHARED_SECRET,
      },
      variables: {
        lineId,
        inCheckout,
        dynamicAttributes: [
          {
            attributeTypeName: EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME,
            attributeElementKey: EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
            attributeElementValue: embroideryText,
          },
        ],
      },
    },
  );
};

export const removeEmbroideryFromLine = async (
  {
    lineId,
  }: {
    lineId: string;
  },
  inCheckout = false,
) => {
  return centraFetch(
    graphql(`
      mutation removeEmbroideryFromLine(
        $lineId: String!
        $dynamicAttributes: [DynamicLineAttributeUnsetInput!]!
        $inCheckout: Boolean!
      ) {
        unsetLineAttributes(lineId: $lineId, dynamicAttributes: $dynamicAttributes) {
          userErrors {
            message
            path
          }
          selection {
            ...checkout @include(if: $inCheckout)
            ...cart @skip(if: $inCheckout)
          }
        }
      }
    `),
    {
      headers: {
        'X-SHARED-SECRET': process.env.GQL_SHARED_SECRET,
      },
      variables: {
        lineId,
        inCheckout,
        dynamicAttributes: [
          {
            attributeTypeName: EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME,
            attributeElementKey: EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
          },
        ],
      },
    },
  );
};
