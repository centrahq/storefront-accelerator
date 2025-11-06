import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';

import { Logo } from '@/components/layout/Logo';
import { Cart } from '@/features/cart/components/CartPanel';
import { NavLink, ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getCountries, getLanguages } from '@/lib/centra/storefront-api/fetchers/noSession';

import { getSession } from '../../lib/centra/sessionCookie';
import { CategoryLinks } from './CategoryLinks';
import { LocalizationPanel } from './LocalizationPanel';
import { NavMenuPanel } from './NavMenuPanel';
import { SearchButton } from './SearchButton';

export const Header = async () => {
  const [countries, languages] = await Promise.all([getCountries(), getLanguages()]);
  const { isLoggedIn } = await getSession();

  const { t } = await getTranslation(['server', 'shop']);

  const links = (
    <>
      <NavLink className="border-b border-transparent py-3" activeClassName="border-b-mono-900" href="/" prefetch>
        {t('server:home')}
      </NavLink>
      <CategoryLinks />
    </>
  );

  return (
    <header>
      <div className="border-mono-300 text-mono-600 flex items-center justify-between border-b py-3 text-sm">
        <span className="text-mono-600 hidden text-sm lg:block">
          Welcome to Centra! Feel free to browse around this webshop, powered by our Storefront API!
        </span>
        <div className="flex w-full justify-between gap-5 lg:w-auto">
          <ShopLink href="/contact">Contact us</ShopLink>
          <span className="hidden lg:block">|</span>
          <LocalizationPanel
            countries={countries.map((country) => ({
              code: country.code,
              name: country.translations.reduce<Record<string, string>>((acc, cur) => {
                acc[cur.language.code] = cur.name;
                return acc;
              }, {}),
            }))}
            languages={languages.map((lang) => ({ code: lang.code, name: lang.name }))}
          />
        </div>
      </div>
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center justify-between gap-y-4 font-medium">
        <div className="flex h-12 items-center lg:hidden">
          <NavMenuPanel>
            <nav className="flex flex-col">{links}</nav>
            <div className="mt-auto flex flex-col gap-3">
              <div className="relative flex h-10 flex-col">
                <SearchButton withLabel />
              </div>
              <ShopLink href={isLoggedIn ? '/account' : '/login'} className="flex items-center gap-2">
                <UserIcon className="size-6" aria-hidden="true" />
                <span className="py-2">{isLoggedIn ? t('server:user.my-account') : t('shop:user.login')}</span>
              </ShopLink>
            </div>
          </NavMenuPanel>
        </div>
        <ShopLink href="/" className="text-2xl" prefetch>
          <Logo />
        </ShopLink>
        <nav className="hidden justify-between gap-10 lg:flex">{links}</nav>
        <div className="ml-auto flex justify-between gap-8 md:gap-10">
          <div className="hidden md:block">
            <SearchButton withBackground />
          </div>
          <div className="hidden md:block">
            <ShopLink href={isLoggedIn ? '/account' : '/login'} className="flex items-center gap-2">
              <UserIcon className="size-6" aria-hidden="true" />
              <span className="sr-only">{isLoggedIn ? t('server:user.my-account') : t('shop:user.login')}</span>
            </ShopLink>
          </div>
          <Suspense fallback={<ShoppingBagIcon className="size-6" aria-hidden="true" />}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
