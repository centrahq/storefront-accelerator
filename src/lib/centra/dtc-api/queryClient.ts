import { isServer, MutationCache, QueryClient } from '@tanstack/react-query';

import { CentraError, UserError } from '../errors';

const makeQueryClient = () => {
  const mutationCache = new MutationCache({
    onError: (error) => {
      // Use you client side error tracking solution here
      if (process.env.NODE_ENV === 'development') {
        if (error instanceof UserError) {
          console.error(error.name, JSON.stringify(error.userErrors, null, 2), `Trace ID: ${error.traceId ?? 'N/A'}`);
        } else if (error instanceof CentraError) {
          console.error(error.name, JSON.stringify(error.centraErrors, null, 2), `Trace ID: ${error.traceId ?? 'N/A'}`);
        }
      }
    },
  });

  return new QueryClient({
    mutationCache,
    defaultOptions: {
      queries: {
        staleTime: 10_000,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();

  return browserQueryClient;
};
