import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { AccountSideNavigation } from '@/components/layout/AccountSideNavigation';
import { getSession } from '@/lib/centra/sessionCookie';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn } = await getSession();

  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="flex h-max w-full flex-col lg:sticky lg:top-8 lg:w-64">
            <AccountSideNavigation />
          </div>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
