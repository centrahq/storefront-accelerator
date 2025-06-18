import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { LogoutButton } from '@/features/profile/components/LogoutButton';
import { getSession } from '@/lib/centra/sessionCookie';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const { t } = await getTranslation(['server']);
  const { isLoggedIn } = await getSession();

  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <title>{t('server:user.my-account')}</title>
        <div className="flex justify-between">
          <h1 className="text-4xl font-medium">{t('server:user.my-account')}</h1>
          <LogoutButton />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
