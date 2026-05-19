'use client';

import { AddressElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';
import { checkUnavailableItems, REMOVED_ITEMS_PARAM } from '@/lib/utils/unavailableItems';
import { AddressInput, ExpressCheckoutWidgetType } from '@gql/graphql';

import { useSetAddress } from '../../mutations';
import { checkoutQuery, expressCheckoutWidgetsQuery } from '../../queries';
import { isNonEmptyString, parseStripeParameters } from '../Payment/StripeExpressCheckout/helpers';

interface Props {
  language: string;
  market: number;
}

const splitName = (name: string): { firstName: string; lastName: string } => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] ?? '', lastName: '' };
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] ?? '' };
};

const StripeAddressFormInner = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { t } = useTranslation(['checkout', 'shop']);
  const setAddressMutation = useSetAddress();
  const { data } = useSuspenseQuery(checkoutQuery);
  const { shippingAddress } = data.checkout;
  const [email, setEmail] = useState(shippingAddress.email ?? '');

  const defaultName = [shippingAddress.firstName, shippingAddress.lastName].filter(Boolean).join(' ');

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const addressEl = elements.getElement('address');
    if (!addressEl) return;

    const { complete, value } = await addressEl.getValue();
    if (!complete || !email.trim()) {
      toast.error(t('checkout:errors.fill-in-required-fields'));
      return;
    }

    const { firstName, lastName } = splitName(value.name);
    const address: AddressInput = {
      firstName,
      lastName,
      address1: value.address.line1,
      address2: value.address.line2 ?? undefined,
      city: value.address.city,
      state: value.address.state || undefined,
      zipCode: value.address.postal_code,
      country: value.address.country,
      phoneNumber: value.phone,
      email,
    };

    setAddressMutation.mutate(
      { shippingAddress: address, billingAddress: address },
      {
        onSuccess: () => {
          router.push('/checkout/delivery');
        },
        onError: (error) => {
          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            router.push(`/checkout?${REMOVED_ITEMS_PARAM}=true`);
          } else {
            toast.error(t('checkout:errors.save-address'));
          }
        },
      },
    );
  };

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-5">
      <h2 className="text-xl font-medium">{t('checkout:shipping-address')}</h2>
      <AddressElement
        options={{
          mode: 'shipping',
          defaultValues: {
            name: defaultName || undefined,
            phone: shippingAddress.phoneNumber ?? undefined,
            address: {
              line1: shippingAddress.address1 ?? '',
              line2: shippingAddress.address2 ?? '',
              city: shippingAddress.city ?? '',
              state: shippingAddress.state?.code ?? '',
              postal_code: shippingAddress.zipCode ?? '',
              country: shippingAddress.country?.code ?? '',
            },
          },
          fields: { phone: 'always' },
        }}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="stripe-address-email">{t('shop:addressForm.labels.email')}</label>
        <input
          id="stripe-address-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-mono-300 border px-6 py-3 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || !elements || setAddressMutation.isPending}
        className={clsx(
          'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
          { 'animate-pulse': setAddressMutation.isPending },
        )}
      >
        {t('checkout:continue')}
      </button>
    </form>
  );
};

export const StripeAddressForm = ({ language, market }: Props) => {
  const { data: cart } = useSuspenseQuery(checkoutQuery);

  const cartTotalInMinor = useMemo(() => {
    const value = cart.checkout.totals.find((total) => total.type === 'GRAND_TOTAL')?.price.value ?? 0;
    return Math.round(value * 100);
  }, [cart.checkout.totals]);

  const lineItems = useMemo(
    () =>
      cart.lines
        .filter((line): line is NonNullable<typeof line> => line !== null)
        .map((line) => ({ name: line.displayItem.name, price: line.lineValue.value.toFixed(2) })),
    [cart.lines],
  );

  const returnUrl = typeof window !== 'undefined' ? `${window.location.origin}/success` : '/success';

  const { data: stripeConfig } = useQuery(
    expressCheckoutWidgetsQuery({
      type: ExpressCheckoutWidgetType.ExpressCheckoutStripePaymentIntents,
      returnUrl,
      amount: cartTotalInMinor,
      lineItems,
      language,
      market,
    }),
  );

  const stripeParameters = useMemo(
    () => parseStripeParameters(stripeConfig?.stripeParameters),
    [stripeConfig?.stripeParameters],
  );

  const publishableKey = isNonEmptyString(stripeConfig?.publishableKey)
    ? stripeConfig.publishableKey
    : stripeParameters.publishableKey;

  const currency = useMemo(() => {
    const value =
      stripeConfig?.paymentAmount?.currency ??
      stripeConfig?.currency ??
      stripeParameters.currency ??
      cart.grandTotal.currency.code;
    return isNonEmptyString(value) ? value.toLowerCase() : undefined;
  }, [
    stripeConfig?.paymentAmount?.currency,
    stripeConfig?.currency,
    stripeParameters.currency,
    cart.grandTotal.currency.code,
  ]);

  const amount = useMemo(() => {
    const configured = stripeConfig?.paymentAmount?.amount;
    if (configured && configured > 0) return Math.round(configured);
    return cartTotalInMinor > 0 ? cartTotalInMinor : 100;
  }, [stripeConfig?.paymentAmount?.amount, cartTotalInMinor]);

  const stripePromise = useMemo(
    () => (isNonEmptyString(publishableKey) ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  if (!stripePromise || !currency) {
    return (
      <div className="flex min-h-24 w-full items-center justify-center">
        <div className="text-mono-800 size-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <Elements
      key={`${publishableKey ?? 'none'}-${currency}`}
      stripe={stripePromise}
      options={{ amount, currency, mode: 'payment' }}
    >
      <StripeAddressFormInner />
    </Elements>
  );
};
