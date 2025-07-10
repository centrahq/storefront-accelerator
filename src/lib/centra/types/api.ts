interface Extensions {
  token: string;
  traceId: string;
}

interface Error {
  message: string;
  path?: string[];
}

export type CentraSuccessResponse<TResult> = {
  data: TResult;
  extensions: Extensions;
};

export type CentraErrorResponse = {
  data: null;
  errors: Error[];
  extensions?: Extensions;
};

export type CentraResponse<TResult> = CentraErrorResponse | CentraSuccessResponse<TResult>;
