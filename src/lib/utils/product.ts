import { ItemFragment } from '@gql/graphql';

export const getItemName = (item: ItemFragment, countryCode: string | undefined) => {
  const localized = item.sizeLocalization.find((mapping) =>
    mapping.countries.some((country) => country.code === countryCode),
  );

  return localized?.name ?? item.name;
};

export const getPriceByMarketPricelist = <T>(
  priceData: Array<{
    pricelist: { id: number };
    priceByMarket: Array<{ markets: number[]; price: T }>;
  }>,
  market: number,
  pricelist: number,
) => {
  return priceData
    .find((prices) => prices.pricelist.id === pricelist)
    ?.priceByMarket.find((prices) => prices.markets.includes(market))?.price;
};
