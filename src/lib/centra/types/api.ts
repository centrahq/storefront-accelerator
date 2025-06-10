import { UserError } from '@gql/graphql';

interface Extensions {
  token: string;
  traceId: string;
}

export type CentraSuccessResponse<TResult> = {
  data: TResult;
  extensions: Extensions;
};

export type CentraErrorResponse = {
  data: null;
  errors: UserError[];
  extensions?: Extensions;
};

export type CentraResponse<TResult> = CentraErrorResponse | CentraSuccessResponse<TResult>;
