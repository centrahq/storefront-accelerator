import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

import { NavLink, ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { logout } from '@/features/profile/actions';

export const AccountSideNavigation = async () => {
  const { t } = await getTranslation(['server']);

  return (
    <nav className="flex flex-col gap-2">
      <h1 className="text-mono-900 mb-4 hidden text-lg font-medium lg:block">
        <ShopLink href="/account" className="hover:underline">
          {t('server:user.my-account')}
        </ShopLink>
      </h1>
      <div className="flex flex-col gap-2 lg:gap-1">
        <NavLink
          href="/account/orders"
          className="text-mono-600 hover:text-mono-900 rounded-md px-3 py-2 text-sm lg:text-base"
          activeClassName="bg-mono-100 text-mono-900 font-medium"
        >
          {t('server:user.my-orders')}
        </NavLink>

        <NavLink
          href="/account/subscriptions"
          className="text-mono-600 hover:text-mono-900 rounded-md px-3 py-2 text-sm lg:text-base"
          activeClassName="bg-mono-100 text-mono-900 font-medium"
        >
          {t('server:user.my-subscriptions')}
        </NavLink>

        <form action={logout} className="lg:mt-12">
          <button
            type="submit"
            className="text-mono-900 hover:bg-mono-100 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium lg:text-base"
          >
            <ArrowRightEndOnRectangleIcon className="size-5" aria-hidden="true" />
            <span>{t('server:user.logout')}</span>
          </button>
        </form>
      </div>
    </nav>
  );
};
