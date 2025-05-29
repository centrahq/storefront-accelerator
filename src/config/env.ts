import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_GQL_API: z.string(),
  GQL_AUTHORIZATION: z.string(),
  NO_SESSION_GQL_API: z.string(),
  NO_SESSION_GQL_AUTHORIZATION: z.string(),
  NO_SESSION_GQL_SHARED_SECRET: z.string(),
  CENTRA_WEBHOOK_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = () => {
  const parsedEnv = envSchema.safeParse({
    NEXT_PUBLIC_GQL_API: process.env.NEXT_PUBLIC_GQL_API,
    GQL_AUTHORIZATION: process.env.GQL_AUTHORIZATION,
    NO_SESSION_GQL_API: process.env.NO_SESSION_GQL_API,
    NO_SESSION_GQL_AUTHORIZATION: process.env.NO_SESSION_GQL_AUTHORIZATION,
    NO_SESSION_GQL_SHARED_SECRET: process.env.NO_SESSION_GQL_SHARED_SECRET,
    CENTRA_WEBHOOK_SECRET: process.env.CENTRA_WEBHOOK_SECRET,
  });

  if (!parsedEnv.success) {
    throw new Error(`The following environment variables are missing or invalid:
      ${Object.entries(parsedEnv.error.flatten().fieldErrors)
        .map(([k, v]) => `- ${k}: ${v.toString()}`)
        .join('\n')}
      `);
  }
};
