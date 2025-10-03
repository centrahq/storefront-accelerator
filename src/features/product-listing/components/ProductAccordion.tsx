import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Trans } from 'react-i18next/TransWithoutContext';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductDetailsFragment } from '@gql/graphql';

import { ProductDescription } from './ProductDescription/ProductDescription';

export const ProductAccordion = async ({ product }: { product: ProductDetailsFragment }) => {
  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-3">
      {product.description.formatted && (
        <Disclosure defaultOpen>
          <div className="flex flex-col">
            <DisclosureButton className="group border-b-mono-300 flex items-center gap-2.5 border-b py-3 text-xl">
              <span>{t('server:product.accordion.product-description')}</span>
              <PlusIcon className="size-4 group-data-open:hidden" aria-hidden="true" />
              <MinusIcon className="hidden size-4 group-data-open:block" aria-hidden="true" />
            </DisclosureButton>
            <DisclosurePanel className="py-3">
              <ProductDescription description={product.description.formatted} />
            </DisclosurePanel>
          </div>
        </Disclosure>
      )}
      <Disclosure>
        <div className="flex flex-col">
          <DisclosureButton className="group border-b-mono-300 flex items-center gap-2.5 border-b py-3 text-xl">
            <span>{t('server:product.accordion.product-details')}</span>
            <PlusIcon className="size-4 group-data-open:hidden" aria-hidden="true" />
            <MinusIcon className="hidden size-4 group-data-open:block" aria-hidden="true" />
          </DisclosureButton>
          <DisclosurePanel className="py-3">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              {product.collection && (
                <>
                  <dt className="text-mono-500">{t('server:product.accordion.collection')}:</dt>
                  <dd>{product.collection.name}</dd>
                </>
              )}
              {product.brand && (
                <>
                  <dt className="text-mono-500">{t('server:product.accordion.brand')}:</dt>
                  <dd>{product.brand.name}</dd>
                </>
              )}
              <dt className="text-mono-500">{t('server:product.accordion.variant')}:</dt>
              <dd>{product.productVariant.name}</dd>
            </dl>
          </DisclosurePanel>
        </div>
      </Disclosure>
      <Disclosure>
        <div className="flex flex-col">
          <DisclosureButton className="group border-b-mono-300 flex items-center gap-2.5 border-b py-3 text-xl">
            <span>{t('server:product.accordion.delivery-and-returns')}</span>
            <PlusIcon className="size-4 group-data-open:hidden" aria-hidden="true" />
            <MinusIcon className="hidden size-4 group-data-open:block" aria-hidden="true" />
          </DisclosureButton>
          <DisclosurePanel className="py-3">
            <p className="text-mono-600">
              <Trans t={t} i18nKey="server:product.accordion.delivery-returns-text">
                See
                <ShopLink href="/shipping" className="underline underline-offset-2">
                  delivery
                </ShopLink>
                and
                <ShopLink href="/returns" className="underline underline-offset-2">
                  returns
                </ShopLink>
                for more information.
              </Trans>
            </p>
          </DisclosurePanel>
        </div>
      </Disclosure>
    </div>
  );
};
