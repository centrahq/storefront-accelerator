import { loadEnvConfig } from '@next/env';
import { resolve } from 'path';

loadEnvConfig(resolve(__dirname));

module.exports = {
  projects: {
    default: {
      schema: [
        {
          [process.env.NO_SESSION_GQL_API]: {
            headers: {
              'Authorization': `Bearer ${process.env.NO_SESSION_GQL_AUTHORIZATION}`,
              'x-shared-secret': process.env.NO_SESSION_GQL_SHARED_SECRET,
            },
          },
        },
      ],
      /*
        // Uncomment to use offline local schema
        schema: ['./gql/dtc_schema.graphql'],
      */
      documents: ['src/**/*.{ts,tsx,graphql}'],
      extensions: {
        codegen: {
          generates: {
            'gql/': {
              plugins: [],
              preset: 'client',
              presetConfig: {
                fragmentMasking: false,
              },
              config: {
                documentMode: 'string',
                skipTypename: true,
                scalars: {
                  DateTimeTz: 'string',
                  Date: 'string',
                  Map: 'Record<string, unknown>',
                },
              },
            },
            'gql/dtc_schema.graphql': {
              plugins: ['schema-ast'],
            },
          },
          overwrite: true,
        },
      },
    },
  },
};
