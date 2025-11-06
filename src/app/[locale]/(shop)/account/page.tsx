import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:user.my-account'),
  };
}

const getCustomer = async () => {
  const customerResponse = await centraFetch(
    graphql(`
      query customer {
        customer {
          firstName
        }
      }
    `),
  );

  return customerResponse.data.customer;
};

export default async function AccountPage() {
  const { t } = await getTranslation(['server']);
  const customer = await getCustomer();

  if (!customer) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-5xl">
        {t('server:user.welcome', {
          firstName: customer.firstName,
        })}
      </h2>
    </div>
  );
}
