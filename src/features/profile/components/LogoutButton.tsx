import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

import { getTranslation } from '@/features/i18n/useTranslation/server';

import { logout } from '../actions';

export const LogoutButton = async () => {
  const { t } = await getTranslation(['server']);

  return (
    <form action={logout}>
      <button type="submit" className="flex items-center justify-center gap-2">
        <span>{t('server:user.logout')}</span>
        <ArrowRightEndOnRectangleIcon className="size-6" />
      </button>
    </form>
  );
};
