import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { z } from 'zod';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ResetPasswordForm } from '@/features/profile/components/ResetPasswordForm';
import { getSession } from '@/lib/centra/sessionCookie';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { t } = await getTranslation(['server']);
  const { isLoggedIn } = await getSession();

  if (isLoggedIn) {
    return redirect('/account');
  }

  const searchSchema = z.object({
    i: z.string(),
    id: z.string(),
  });

  const parsedParams = searchSchema.safeParse(await searchParams);

  if (parsedParams.error) {
    return notFound();
  }

  return (
    <>
      <title>{t('server:user.reset-password.reset-password')}</title>
      <div>
        <div className="mx-auto max-w-7xl">
          <ResetPasswordForm i={parsedParams.data.i} id={parsedParams.data.id} />
        </div>
      </div>
    </>
  );
}
