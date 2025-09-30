import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';

const PAGE_GROUPING = 3;

interface Props {
  page: number;
  lastPage: number;
  label: string;
  getPageHref: (page: number) => string;
}

export const PaginationSkeleton = () => {
  return (
    <div className="w-max animate-pulse">
      <div className="flex items-stretch gap-2 border border-transparent py-2">
        {Array.from(Array(PAGE_GROUPING), (_, index) => (
          <div key={index} className="flex w-14 items-center justify-center">
            <div className="bg-mono-500 h-5 w-full rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Pagination = async ({ page, lastPage, getPageHref, label }: Props) => {
  const from = Math.max(1, Math.min(lastPage - PAGE_GROUPING + 1, Math.ceil(page - PAGE_GROUPING / 2)));
  const { t } = await getTranslation(['server']);

  return (
    <nav role="navigation" aria-label={label} className="w-max text-sm font-medium">
      <ul className="flex items-stretch gap-2">
        {page > 1 && (
          <li>
            <ShopLink
              className="border-mono-300 flex h-full items-center justify-center gap-1 border px-6 py-2"
              href={getPageHref(page - 1)}
              prefetch={false}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
              <span>{t('server:pagination.previous')}</span>
            </ShopLink>
          </li>
        )}
        {from > 1 && (
          <li aria-hidden>
            <div className="border-mono-300 flex h-full items-center justify-center border px-6 py-2">
              <EllipsisHorizontalIcon className="size-6" aria-hidden="true" />
            </div>
          </li>
        )}
        {Array.from(Array(PAGE_GROUPING), (_, index) => from + index)
          .filter((pageNumber) => pageNumber <= lastPage)
          .map((pageNumber) => (
            <li key={pageNumber}>
              <ShopLink
                aria-current={pageNumber === page ? 'page' : undefined}
                href={getPageHref(pageNumber)}
                className="border-mono-300 aria-[current]:bg-mono-0 flex h-full items-center justify-center border px-6 py-2"
                prefetch={false}
              >
                {pageNumber}
              </ShopLink>
            </li>
          ))}
        {from + PAGE_GROUPING - 1 < lastPage && (
          <li aria-hidden>
            <div className="border-mono-300 flex h-full items-center justify-center border px-6 py-2">
              <EllipsisHorizontalIcon className="size-6" aria-hidden="true" />
            </div>
          </li>
        )}
        {page < lastPage && (
          <li>
            <ShopLink
              className="border-mono-300 flex h-full items-center justify-center gap-1 border px-6 py-2"
              href={getPageHref(page + 1)}
              prefetch={false}
            >
              <span>{t('server:pagination.next')}</span>
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </ShopLink>
          </li>
        )}
      </ul>
    </nav>
  );
};
