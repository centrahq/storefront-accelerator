import { UserError as CentraUserError } from '@gql/graphql';

import { CentraErrorResponse } from './types/api';

export class UserError extends Error {
  constructor(
    public userErrors: CentraUserError[],
    public traceId?: string,
  ) {
    super(JSON.stringify(userErrors, null, 2));
    this.name = 'UserError';
  }
}

export class CentraError extends Error {
  constructor(
    public centraErrors: CentraErrorResponse['errors'],
    public traceId?: string,
  ) {
    super(JSON.stringify(centraErrors, null, 2));
    this.name = 'CentraError';
  }
}
