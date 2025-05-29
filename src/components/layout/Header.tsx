import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';

import { Logo } from '@/components/layout/Logo';
import { Cart } from '@/features/cart/components/CartPanel';
import { NavLink, ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getCountriesAndLanguages } from '@/lib/centra/dtc-api/fetchers/noSession';

import { WithSession } from '../WithSession';
import { CategoryLinks } from './CategoryLinks';
import { LocalizationPanel } from './LocalizationPanel';
import { NavMenuPanel } from './NavMenuPanel';
import { SearchButton } from './SearchButton';

export const Header = async () => {
  const { countries, languages } = await getCountriesAndLanguages();
  const { t } = await getTranslation(['server', 'shop']);

  const links = (
    <>
      <NavLink className="border-b border-transparent py-3" activeClassName="border-b-mono-900" href="/">
        Home
      </NavLink>
      <CategoryLinks />
    </>
  );

  return (
    <header>
      <div className="border-mono-300 text-mono-600 flex items-center justify-between border-b py-3 text-sm">
        <span className="hidden lg:block">
          Now you can order our socks in subscriptions to enjoy them all the time!
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
              <Suspense fallback={null}>
                <WithSession>
                  {({ isLoggedIn }) => (
                    <ShopLink href={isLoggedIn ? '/account' : '/login'} className="flex items-center gap-2">
                      <UserIcon className="size-6" />
                      <span className="py-2">{isLoggedIn ? t('server:user.my-account') : t('shop:user.login')}</span>
                    </ShopLink>
                  )}
                </WithSession>
              </Suspense>
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
            <Suspense fallback={<UserIcon className="size-6" />}>
              <WithSession>
                {({ isLoggedIn }) => (
                  <ShopLink href={isLoggedIn ? '/account' : '/login'} className="flex items-center gap-2">
                    <UserIcon className="size-6" />
                    <span className="sr-only">{isLoggedIn ? t('server:user.my-account') : t('shop:user.login')}</span>
                  </ShopLink>
                )}
              </WithSession>
            </Suspense>
          </div>
          <Suspense fallback={<ShoppingBagIcon className="size-6" />}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
