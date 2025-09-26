import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ForgotPasswordForm } from '@/features/profile/components/ForgotPasswordForm';
import { getSession } from '@/lib/centra/sessionCookie';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:user.reset-password.forgot-password'),
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function ForgotPasswordPage() {
  const { isLoggedIn } = await getSession();

  if (isLoggedIn) {
    redirect('/account');
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
