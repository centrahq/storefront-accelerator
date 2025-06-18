import { NavLink } from '@/features/i18n/routing/ShopLink';
import { getRootCategories } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';

export const CategoryLinks = async () => {
  const { market, language } = await getSession();

  const categories = await getRootCategories({
    limit: 3,
    language,
    market,
  }).catch(() => []);

  return categories.map(({ name, uri }) => {
    return (
      <NavLink
        key={uri}
        className="border-b border-transparent py-3"
        activeClassName="border-b-mono-900"
        href={`/${uri}`}
        prefetch
      >
        {name}
      </NavLink>
    );
  });
};
