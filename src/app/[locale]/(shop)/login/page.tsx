import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { generateAlternates } from '@/features/i18n/metadata';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { LoginForm } from '@/features/profile/components/LoginForm';
import { RegisterForm } from '@/features/profile/components/RegisterForm';
import { getSession } from '@/lib/centra/sessionCookie';
import { getCountries } from '@/lib/centra/storefront-api/fetchers/noSession';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { t } = await getTranslation(['shop']);

  return {
    title: t('shop:user.login'),
    alternates: {
      canonical: `/${(await params).locale}/login`,
      languages: await generateAlternates('/login'),
    },
  };
}

export default async function LoginPage() {
  const { country, state, language, isLoggedIn } = await getSession();

  if (isLoggedIn) {
    redirect('/account');
  }

  const countries = (await getCountries())
    .map((country) => ({
      code: country.code,
      name: country.translations.find((translation) => translation.language.code === language)?.name ?? country.name,
      states: country.states?.toSorted((a, b) => a.name.localeCompare(b.name)),
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-32">
        <LoginForm />
        <RegisterForm defaultCountry={country} defaultState={state} countries={countries} />
      </div>
    </div>
  );
}
