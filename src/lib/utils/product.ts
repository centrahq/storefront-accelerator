import { ItemFragment, VariantSwatchFragment } from '@gql/graphql';

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
 * Extracts the color code from a variant swatch attribute. Assumes a swatch custom attribute is set with `variant_swatch`. Example:
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

  if (colorCodeElement?.__typename !== 'AttributeStringElement') {
    return undefined;
  }

  return colorCodeElement.value;
};
