'use client';

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';

import { usePaymentInstructions } from '../../mutations';
import { checkoutQuery, StripeParameters } from '../../queries';
import { showItemsRemovedToast } from '../../utils/showItemsRemovedToast';

type StripeFormFields = {
  publishableKey?: string;
  clientSecret?: string;
  stripeParameters?: string | StripeParameters;
};

type StripeConfig = {
  publishableKey: string;
  clientSecret: string;
  returnUrl: string;
};

type BillingDetails = {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
};

type ShippingDetails = {
  name: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
};

type CheckoutAddress = {
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zipCode?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  country?: { code: string } | null;
  state?: { code: string } | null;
};

type WidgetState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; config: StripeConfig };

const toOptional = (value?: string | null): string | undefined =>
  value != null && value.trim() !== '' ? value : undefined;

const parseStripeParameters = (raw?: string | StripeParameters): StripeParameters => {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as StripeParameters;
    } catch {
      return {};
    }
  }
  return raw ?? {};
};

const buildBillingDetails = (address: CheckoutAddress): BillingDetails => {
  const name = [address.firstName, address.lastName].filter(Boolean).join(' ') || undefined;
  return {
    name: toOptional(name),
    email: toOptional(address.email ?? undefined),
    phone: toOptional(address.phoneNumber ?? undefined),
    address: {
      line1: toOptional(address.address1 ?? undefined),
      line2: toOptional(address.address2 ?? undefined),
      city: toOptional(address.city ?? undefined),
      postal_code: toOptional(address.zipCode ?? undefined),
      country: toOptional(address.country?.code),
      state: toOptional(address.state?.code),
    },
  };
};

const buildShippingDetails = (address: CheckoutAddress, fallbackName?: string): ShippingDetails | undefined => {
  const line1 = address.address1?.trim();
  if (!line1) {
    return undefined;
  }
  const name = [address.firstName, address.lastName].filter(Boolean).join(' ') || fallbackName;
  if (!name) {
    return undefined;
  }
  return {
    name,
    phone: toOptional(address.phoneNumber ?? undefined),
    address: {
      line1,
      line2: toOptional(address.address2 ?? undefined),
      city: toOptional(address.city ?? undefined),
      postal_code: toOptional(address.zipCode ?? undefined),
      country: toOptional(address.country?.code),
      state: toOptional(address.state?.code),
    },
  };
};

const StripeCheckoutForm = ({
  returnUrl,
  billingDetails,
  shippingDetails,
}: {
  returnUrl: string;
  billingDetails: BillingDetails;
  shippingDetails: ShippingDetails | undefined;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation(['checkout']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: { billing_details: billingDetails },
        ...(shippingDetails ? { shipping: shippingDetails } : {}),
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message ?? t('checkout:something-went-wrong'), { id: 'stripe-payment-error' });
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      window.location.assign(returnUrl);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className={clsx(
          'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
          { 'animate-pulse': isSubmitting },
        )}
      >
        {t('checkout:place-order')}
      </button>
    </form>
  );
};

export const StripePaymentIntentsWidget = ({ id }: { id: number }) => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const { t } = useTranslation(['checkout']);
  const [widgetState, setWidgetState] = useState<WidgetState>({ status: 'loading' });
  const mutationFiredRef = useRef(false);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;

  const billingDetails = buildBillingDetails(billingAddress ?? shippingAddress);
  const shippingDetails = buildShippingDetails(shippingAddress, billingDetails.name);

  const stripePromise = useMemo((): Promise<Stripe | null> | null => {
    if (widgetState.status !== 'ready') return null;
    return loadStripe(widgetState.config.publishableKey);
  }, [widgetState]);

  useEffect(() => {
    if (widgetState.status !== 'loading' || mutationFiredRef.current) {
      return;
    }
    mutationFiredRef.current = true;

    getPaymentInstructions(
      {
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        paymentMethod: id,
        shippingAddress: {
          ...shippingAddress,
          country: shippingAddress.country?.code ?? '',
          state: shippingAddress.state?.code,
        },
        separateBillingAddress: billingAddress
          ? {
              ...billingAddress,
              country: billingAddress.country?.code ?? '',
              state: billingAddress.state?.code,
            }
          : null,
      },
      {
        onSuccess: (responseData) => {
          const action = responseData.action;

          if (action?.__typename !== 'FormPaymentAction' || action.formType !== 'stripe-payment-intents') {
            setWidgetState({ status: 'error' });
            return;
          }

          const formFields = action.formFields as StripeFormFields | undefined;
          const publishableKey = formFields?.publishableKey?.trim();
          const clientSecret = formFields?.clientSecret?.trim();

          if (!publishableKey || !clientSecret) {
            setWidgetState({ status: 'error' });
            return;
          }

          const stripeParameters = parseStripeParameters(formFields?.stripeParameters);
          const returnUrl = stripeParameters.returnUrl ?? `${window.location.origin}/success`;

          setWidgetState({ status: 'ready', config: { publishableKey, clientSecret, returnUrl } });
        },
        onError: (error) => {
          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            showItemsRemovedToast();
          } else {
            setWidgetState({ status: 'error' });
          }
        },
      },
    );
  }, [billingAddress, getPaymentInstructions, id, shippingAddress, widgetState.status]);

  if (widgetState.status === 'loading') {
    return (
      <div className="flex min-h-24 w-full items-center justify-center">
        <div className="text-mono-800 size-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (widgetState.status === 'error') {
    return (
      <p className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
        {t('checkout:something-went-wrong')}
      </p>
    );
  }

  if (!stripePromise) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: widgetState.config.clientSecret }}>
      <StripeCheckoutForm
        returnUrl={widgetState.config.returnUrl}
        billingDetails={billingDetails}
        shippingDetails={shippingDetails}
      />
    </Elements>
  );
};
