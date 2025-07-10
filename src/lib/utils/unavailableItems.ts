import { UserError } from '@gql/graphql';

export const REMOVED_ITEMS_PARAM = 'removedItems';

export const checkUnavailableItems = (errors: UserError[]) => {
  return errors.some((error) => '__typename' in error && error.__typename === 'UnavailableItem');
};
