export type GQLResponse<TResult> =
  | {
      data: TResult;
      extensions: { token: string; traceId: string };
    }
  | {
      data: null;
      errors: { message: string; path?: string[] }[];
      extensions?: { token: string; traceId: string };
    };
