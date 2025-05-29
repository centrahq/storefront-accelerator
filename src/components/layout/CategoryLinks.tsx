import { localeParam } from '@/features/i18n/routing/localeParam';
import { NavLink } from '@/features/i18n/routing/ShopLink';
import { getRootCategories } from '@/lib/centra/dtc-api/fetchers/noSession';

export const CategoryLinks = async () => {
  const { language } = localeParam;

  const categories = await getRootCategories({
    limit: 3,
  }).catch(() => []);

  return categories.map(({ id, translations }) => {
    const translation = translations.find((t) => t.language.code === language);

    if (!translation) {
      return null;
    }

    return (
      <NavLink
        key={id}
        className="border-b border-transparent py-3"
        activeClassName="border-b-mono-900"
        href={`/category/${translation.uri}.${id}`}
      >
        {translation.name}
      </NavLink>
    );
  });
};
