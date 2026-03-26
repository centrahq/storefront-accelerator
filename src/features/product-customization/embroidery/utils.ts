import { LineFragment } from '@gql/graphql';

import { EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY, EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME } from './constants';

/**
 * Extracts the embroidery text from a product.
 * Assumes an embroidery text custom attribute is set with `embroidery_customization` name. Example:
 * ```json
 * {
 *   "desc": "Embroidery customization",
 *   "group": "order_line",
 *   "readonly": false,
 *   "elements": {
 *     "text": {
 *       "desc": "Embroidery text",
 *       "type": "input",
 *       "showOnLine": true
 *     }
 *   }
 * }
 * ```
 * Attribute must be enabled in "Line attributes" field under Storefront API plugin settings.
 */
export const getEmbroideryText = (attributes: LineFragment['attributes']) => {
  const attribute = attributes.find((attribute) => attribute.type.name === EMBROIDERY_TEXT_ATTRIBUTE_TYPE_NAME);

  if (attribute?.__typename !== 'DynamicAttribute') {
    return;
  }

  const embroideryTextElement = attribute.elements.find(
    (element) => element.key === EMBROIDERY_TEXT_ATTRIBUTE_ELEMENT_KEY,
  );

  if (embroideryTextElement?.__typename === 'AttributeStringElement') {
    return embroideryTextElement.value;
  }
};
