import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_GQL_API: z.string(),
  GQL_AUTHORIZATION: z.string(),
  NO_SESSION_GQL_API: z.string(),
  NO_SESSION_GQL_AUTHORIZATION: z.string(),
  NO_SESSION_GQL_SHARED_SECRET: z.string(),
  CENTRA_WEBHOOK_SECRET: z.string(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long'),
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
    SESSION_SECRET: process.env.SESSION_SECRET,
  });

  if (!parsedEnv.success) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const missingVars = Object.entries(z.treeifyError(parsedEnv.error).properties!);

    throw new Error(
      `The following environment variables are missing or invalid:\n${missingVars.map(([k, v]) => `- ${k}: ${v.errors.join(', ')}`).join('\n')}`,
    );
  }
};
