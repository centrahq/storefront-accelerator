import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { generateAlternates } from '@/features/i18n/metadata';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { lookupCategory } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; category: string[] }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  const { market, language } = await getSession();

  const category = await lookupCategory({
    uri: (await params).category.join('/'),
    language,
    market,
  }).catch(() => notFound());

  return {
    title: category.metaTitle || category.name?.join(' | '),
    description: category.metaDescription || (await parent).description,
    alternates: {
      canonical: `/${locale}/${category.uri}`,
      languages: await generateAlternates(
        (lang) => `/${category.translations.find(({ language }) => language.code === lang)?.uri ?? category.uri}`,
      ),
    },
  };
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string[] }>;
}) {
  const { market, language } = await getSession();
  const { t } = await getTranslation(['server']);

  const uris = (await params).category;

  const category = await lookupCategory({
    uri: uris.join('/'),
    language,
    market,
  }).catch(() => notFound());

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-xs" aria-label={t('server:breadcrumbs')}>
        <ol>
          <li className="inline">
            <ShopLink href="/" className="text-mono-900 hover:underline">
              {t('server:home')}
            </ShopLink>
            <span className="mx-3" aria-hidden="true">
              /
            </span>
          </li>
          {uris.slice(0, -1).map((uri, index) => (
            <li key={uri} className="inline">
              <ShopLink href={`/${uris.slice(0, index + 1).join('/')}`} className="text-mono-900 hover:underline">
                {category.name?.[index]}
              </ShopLink>
              <span className="mx-3" aria-hidden="true">
                /
              </span>
            </li>
          ))}
          <li className="inline">
            <ShopLink href={`/${category.uri}`} className="text-mono-500" aria-current="page">
              {category.name?.at(-1)}
            </ShopLink>
          </li>
        </ol>
      </nav>
      <h1 className="text-4xl font-medium">{category.name?.at(-1)}</h1>
      {category.metaDescription && <p>{category.metaDescription}</p>}
      {category.childCategories.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {category.childCategories.map((child) => (
            <li key={child.uri}>
              <ShopLink
                href={`/${child.uri}`}
                className="text-mono-800 hover:text-mono-500 border-mono-900 border px-2 py-1"
              >
                {child.name?.at(-1)}
              </ShopLink>
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
