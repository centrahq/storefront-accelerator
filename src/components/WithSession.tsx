import { ReactNode } from 'react';

import { getSession, SessionCookie } from '@/lib/centra/sessionCookie';

export const WithSession = async ({ children }: { children: (session: SessionCookie) => ReactNode }) => {
  const session = await getSession();

  return children(session);
};
