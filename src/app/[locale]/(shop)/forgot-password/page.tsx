import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ForgotPasswordForm } from '@/features/profile/components/ForgotPasswordForm';
import { getSession } from '@/lib/centra/sessionCookie';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  localeParam.parse((await params).locale);
  const { t } = await getTranslation(['server']);
  const { isLoggedIn } = await getSession();

  if (isLoggedIn) {
    redirect('/account');
  }

  return (
    <>
      <title>{t('server:user.reset-password.forgot-password')}</title>
      <div>
        <div className="mx-auto max-w-7xl">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
