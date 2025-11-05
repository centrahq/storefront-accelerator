import { ItemFragment, SizeGuideFragment, VariantSwatchFragment } from '@gql/graphql';

/**
 * Returns the localized name of a size based on the provided country code.
 */
export const getItemName = (item: ItemFragment, countryCode: string | undefined) => {
  const localized = item.sizeLocalization.find((mapping) =>
    mapping.countries.some((country) => country.code === countryCode),
  );

  return localized?.name ?? item.name;
};

/**
 * Returns the product URL path for a given product URI.
 */
export function getProductUrl(productUri: string): string {
  return `/product/${productUri}`;
}

/**
 * Extracts the color code from a variant swatch attribute.
 * Assumes a swatch custom attribute is set with `variant_swatch` name. Example:
 * ```json
 * {
 *   "desc": "Variant swatch",
 *   "readonly": false,
 *   "group": "variation",
 *   "elements": {
 *     "color_code": {
 *       "type": "input",
 *       "desc": "Color code"
 *     }
 *   }
 * }
 * ```
 * Attribute must be enabled in "Display item attributes" field under DTC API plugin settings.
 */
export const getSwatchColorCode = (attribute: VariantSwatchFragment['swatch']) => {
  const swatch = attribute[0];

  if (swatch?.__typename !== 'DynamicAttribute') {
    return undefined;
  }

  const colorCodeElement = swatch.elements.find((element) => element.key === 'color_code');

  if (colorCodeElement?.__typename === 'AttributeStringElement') {
    return colorCodeElement.value;
  }
};

/**
 * Extracts the size guide from a product.
 * Assumes a size guide custom attribute is set with `pd_size_guide` name. Example:
 * ```json
 * {
 *   "desc": "Size guide",
 *   "group": "product",
 *   "readonly": false,
 *   "elements": {
 *     "table": {
 *       "desc": "Size guide table",
 *       "type": "textarea"
 *     }
 *   }
 * }
 * ```
 * Attribute must be enabled in "Display item attributes" field under DTC API plugin settings.
 */
export const getSizeGuideTable = (attribute: SizeGuideFragment['sizeGuide']) => {
  const sizeGuide = attribute[0];

  if (sizeGuide?.__typename !== 'DynamicAttribute') {
    return undefined;
  }

  const tableElement = sizeGuide.elements.find((element) => element.key === 'table');

  if (tableElement?.__typename === 'AttributeStringElement') {
    return tableElement.value;
  }
};
