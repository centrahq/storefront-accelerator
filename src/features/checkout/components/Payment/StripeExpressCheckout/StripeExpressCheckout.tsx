'use client';

import { Elements, ExpressCheckoutElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  loadStripe,
  PaymentIntent,
  PaymentIntentResult,
  ShippingRate,
  StripeError,
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementShippingAddressChangeEvent,
  StripeExpressCheckoutElementShippingRateChangeEvent,
} from '@stripe/stripe-js';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { selectionQuery } from '@/features/cart/queries';
import { addToCart, updateLine } from '@/features/cart/service';
import { AddressInput, ExpressCheckoutWidgetType, PaymentMethodKind } from '@gql/graphql';

import { expressCheckoutWidgetsQuery } from '../../../queries';
import { fetchCheckout, setShippingMethod, submitPaymentInstructions } from '../../../service';
import { ExpressCheckoutErrorBoundary } from '../ExpressCheckoutErrorBoundary';
import { debugLog } from './debug';
import {
  createStripeLineItems,
  getCheckoutTotalAmountInMinor,
  getConfirmAddresses,
  getStripeConfig,
  isNonEmptyString,
  mapShippingMethodsToStripeRatesFromCheckout,
  mapShippingMethodsToStripeRatesFromConfig,
  parseStripeParameters,
  type StripeLineItem,
} from './helpers';

interface Props {
  itemId?: string;
  cartTotal: number;
  initialLineItems: {
    name: string;
    price: string;
  }[];
  disabled?: boolean;
  language: string;
  market: number;
}

// ---------------------------------------------------------------------------
// Inner element component -- renders the Stripe ExpressCheckoutElement
// ---------------------------------------------------------------------------

const StripeExpressCheckoutElement = ({
  allowedShippingCountries,
  initialLineItems,
  onCancel,
  onEnsureSelectionReady,
  onRequirePaymentIntent,
  shippingRates,
}: {
  allowedShippingCountries: string[];
  initialLineItems: StripeLineItem[];
  onCancel: () => void;
  onEnsureSelectionReady: () => Promise<void>;
  onRequirePaymentIntent: (addresses: {
    billingAddress?: AddressInput;
    shippingAddress?: AddressInput;
  }) => Promise<{ clientSecret: string; returnUrl: string } | null>;
  shippingRates: ShippingRate[];
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [elementKey, setElementKey] = useState(0);

  const resetExpressCheckoutElement = useCallback(() => {
    setElementKey((currentKey) => currentKey + 1);
  }, []);

  const handleConfirm = useCallback(async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements) {
      debugLog('confirm:aborted:missing-stripe-or-elements', {
        hasElements: Boolean(elements),
        hasStripe: Boolean(stripe),
      });
      event.paymentFailed({ reason: 'fail' });
      resetExpressCheckoutElement();
      return;
    }

    try {
      await onEnsureSelectionReady();
      const confirmAddresses = getConfirmAddresses(event);
      debugLog('confirm:started', {
        billingDetails: event.billingDetails,
        confirmAddresses,
        shippingAddress: event.shippingAddress,
      });
      const config = await onRequirePaymentIntent(confirmAddresses);
      if (!config) {
        debugLog('confirm:aborted:no-config', {});
        event.paymentFailed({ reason: 'fail' });
        resetExpressCheckoutElement();
        return;
      }

      const result: PaymentIntentResult | { error?: StripeError } = await stripe.confirmPayment({
        clientSecret: config.clientSecret,
        confirmParams: { return_url: config.returnUrl },
        elements,
      });
      const { error } = result;
      const { paymentIntent } = result as { paymentIntent?: PaymentIntent };

      debugLog('confirm:result', {
        errorCode: error?.code,
        errorDeclineCode: error?.decline_code,
        errorMessage: error?.message,
        errorType: error?.type,
        paymentIntentId: paymentIntent?.id,
        paymentIntentStatus: paymentIntent?.status,
      });

      if (error) {
        toast.error(error.message ?? 'Unable to confirm payment');
        event.paymentFailed({ reason: 'fail' });
        resetExpressCheckoutElement();
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        window.location.assign(config.returnUrl);
      }
    } catch (err) {
      debugLog('confirm:exception', { error: err });
      toast.error('Unable to confirm payment');
      resetExpressCheckoutElement();
    }
  }, [stripe, elements, onEnsureSelectionReady, onRequirePaymentIntent, resetExpressCheckoutElement]);

  const handleCancel = useCallback(() => {
    debugLog('cancel', { elementKey });
    onCancel();
    resetExpressCheckoutElement();
  }, [elementKey, onCancel, resetExpressCheckoutElement]);

  const onShippingAddressChange = useCallback(
    async ({ resolve, reject, address }: StripeExpressCheckoutElementShippingAddressChangeEvent) => {
      try {
        if (allowedShippingCountries.length > 0 && !allowedShippingCountries.includes(address.country)) {
          reject();
          return;
        }

        await onEnsureSelectionReady();

        const data = await submitPaymentInstructions({
          shippingAddress: {
            address1: '',
            city: address.city,
            country: address.country,
            zipCode: address.postal_code,
            state: address.state,
          },
          paymentReturnPage: `${window.location.origin}/success`,
          paymentFailedPage: `${window.location.origin}/failed`,
          paymentInitiateOnly: true,
        });

        const checkoutData = data.selection;
        const lineItems = createStripeLineItems(checkoutData.checkout.totals);
        const selectedShippingMethod = String(checkoutData.checkout.shippingMethod?.id ?? '');
        const nextShippingRates = [
          ...mapShippingMethodsToStripeRatesFromCheckout(checkoutData.checkout.shippingMethods ?? []),
        ].sort((a, b) => {
          if (a.id === selectedShippingMethod) return -1;
          if (b.id === selectedShippingMethod) return 1;
          return 0;
        });
        const amount = getCheckoutTotalAmountInMinor(checkoutData.checkout.totals);

        elements?.update({ amount });
        debugLog('shippingAddressChange:success', { amount, lineItems, shippingRates: nextShippingRates });
        resolve({ lineItems, shippingRates: nextShippingRates });
      } catch (error) {
        debugLog('shippingAddressChange:error', { error });
        reject();
      }
    },
    [allowedShippingCountries, elements, onEnsureSelectionReady],
  );

  const onShippingRateChange = useCallback(
    async ({ resolve, reject, shippingRate }: StripeExpressCheckoutElementShippingRateChangeEvent) => {
      if (!isNonEmptyString(shippingRate.id)) {
        reject();
        return;
      }
      try {
        debugLog('shippingRateChange:start', { shippingRate });
        await setShippingMethod(Number(shippingRate.id));
        const checkoutData = await fetchCheckout();
        const lineItems = createStripeLineItems(checkoutData.checkout.totals);
        const nextShippingRates = mapShippingMethodsToStripeRatesFromCheckout(
          checkoutData.checkout.shippingMethods ?? [],
        );
        const amount = getCheckoutTotalAmountInMinor(checkoutData.checkout.totals);

        elements?.update({ amount });
        debugLog('shippingRateChange:success', { amount, lineItems, shippingRates: nextShippingRates });
        resolve({ lineItems, shippingRates: nextShippingRates });
      } catch (error) {
        debugLog('shippingRateChange:error', { error, shippingRateId: shippingRate.id });
        reject();
      }
    },
    [elements],
  );

  const expressCheckoutOptions = useMemo(
    () => ({
      allowedShippingCountries,
      billingAddressRequired: true,
      emailRequired: true,
      lineItems: initialLineItems,
      paymentMethods: { googlePay: 'always' as const },
      phoneNumberRequired: true,
      shippingAddressRequired: true,
      shippingRates,
    }),
    [allowedShippingCountries, initialLineItems, shippingRates],
  );

  const handleClick = useCallback(
    async (event: StripeExpressCheckoutElementClickEvent) => {
      debugLog('click', { expressPaymentType: event.expressPaymentType });
      try {
        await onEnsureSelectionReady();
        debugLog('click:selectionReady', {});
        event.resolve();
      } catch (error) {
        debugLog('click:rejected', { error });
        event.reject();
      }
    },
    [onEnsureSelectionReady],
  );

  return (
    <ExpressCheckoutElement
      key={elementKey}
      options={expressCheckoutOptions}
      onClick={handleClick}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      onReady={(event) => {
        debugLog('ready', { availablePaymentMethods: event.availablePaymentMethods, elementKey });
      }}
      onShippingAddressChange={onShippingAddressChange}
      onShippingRateChange={onShippingRateChange}
    />
  );
};

// ---------------------------------------------------------------------------
// Middle wrapper -- loads Stripe, resolves payment intent on confirm
// ---------------------------------------------------------------------------

const StripeExpressCheckoutInner = ({
  itemId,
  cartTotal,
  disabled = false,
  initialLineItems,
  language,
  market,
}: Props) => {
  const { data: selectionData } = useSuspenseQuery(selectionQuery);
  const { lines } = selectionData;
  const hasSubscriptionItems = useMemo(() => lines.some((line) => line?.subscriptionId != null), [lines]);
  const itemRef = useRef<string | undefined>(undefined);
  const addedItemLineRef = useRef<string | null>(null);

  useEffect(() => {
    itemRef.current = itemId;
  }, [itemId]);

  const cartTotalInMinor = Math.round(cartTotal * 100);

  const stripeLineItems = useMemo<StripeLineItem[]>(
    () =>
      initialLineItems.map((li) => ({
        amount: Math.round(Number.parseFloat(li.price) * 100),
        name: li.name,
      })),
    [initialLineItems],
  );

  const { data: paymentConfig } = useQuery(
    expressCheckoutWidgetsQuery({
      type: ExpressCheckoutWidgetType.ExpressCheckoutStripePaymentIntents,
      returnUrl: `${window.location.origin}/success`,
      amount: cartTotalInMinor,
      lineItems: initialLineItems,
      language,
      market,
    }),
  );

  const stripeParameters = useMemo(
    () => parseStripeParameters(paymentConfig?.stripeParameters),
    [paymentConfig?.stripeParameters],
  );

  const publishableKey = isNonEmptyString(paymentConfig?.publishableKey)
    ? paymentConfig.publishableKey
    : stripeParameters.publishableKey;

  const elementsCurrency = useMemo(() => {
    const currency =
      paymentConfig?.paymentAmount?.currency ??
      paymentConfig?.currency ??
      stripeParameters.currency ??
      selectionData.grandTotal.currency.code;
    return isNonEmptyString(currency) ? currency.toLowerCase() : undefined;
  }, [paymentConfig?.paymentAmount?.currency, paymentConfig?.currency, stripeParameters.currency, selectionData.grandTotal.currency.code]);

  const elementsAmountInMinor = useMemo(() => {
    const configuredAmount = paymentConfig?.paymentAmount?.amount;
    if (configuredAmount != null && configuredAmount > 0) {
      return Math.round(configuredAmount);
    }
    return cartTotalInMinor > 0 ? cartTotalInMinor : 100;
  }, [paymentConfig?.paymentAmount?.amount, cartTotalInMinor]);

  const elementsCaptureMethod = useMemo(() => {
    return paymentConfig?.captureMethod ?? stripeParameters.captureMethod ?? 'manual';
  }, [paymentConfig?.captureMethod, stripeParameters.captureMethod]);

  const allowedShippingCountry = useMemo(
    () => paymentConfig?.country ?? stripeParameters.country,
    [paymentConfig?.country, stripeParameters.country],
  );

  const shippingRates = useMemo(
    () => mapShippingMethodsToStripeRatesFromConfig(paymentConfig?.shippingMethods),
    [paymentConfig?.shippingMethods],
  );

  const stripePromise = useMemo(
    () =>
      isNonEmptyString(publishableKey)
        ? loadStripe(publishableKey)
        : null,
    [publishableKey],
  );

  const ensureSelectionReady = useCallback(async () => {
    const currentItemId = itemRef.current;
    if (currentItemId) {
      const checkoutData = await fetchCheckout();
      const hasProductInSelection = checkoutData.lines.some((line) => line?.item.id === currentItemId);
      if (!hasProductInSelection) {
        const addedSelection = await addToCart({ item: currentItemId });
        const addedItem = addedSelection.lines.find((line) => line?.item.id === currentItemId);
        if (addedItem) {
          addedItemLineRef.current = addedItem.id;
          debugLog('ensureSelectionReady:addedItem', { itemId: currentItemId, lineId: addedItem.id });
        }
      }
      return;
    }

    const checkoutData = await fetchCheckout();
    if (checkoutData.lines.length === 0) {
      throw new Error('Selection is empty');
    }
  }, []);

  const requirePaymentIntent = useCallback(
    async (addresses: { billingAddress?: AddressInput; shippingAddress?: AddressInput }) => {
      const checkoutData = await fetchCheckout();
      const stripePaymentMethod = checkoutData.checkout.paymentMethods.find(
        (m) => m.kind === PaymentMethodKind.StripePaymentIntents,
      );

      if (!stripePaymentMethod) {
        debugLog('requirePaymentIntent:aborted:noPaymentMethod', { paymentConfig });
        return null;
      }

      try {
        const shippingAddressSource = addresses.shippingAddress;
        const billingAddressSource = addresses.billingAddress;

        const shippingAddress: AddressInput = shippingAddressSource
          ? {
            address1: shippingAddressSource.address1,
            address2: shippingAddressSource.address2,
            city: shippingAddressSource.city,
            country: shippingAddressSource.country,
            email: shippingAddressSource.email ?? billingAddressSource?.email,
            firstName: shippingAddressSource.firstName,
            lastName: shippingAddressSource.lastName,
            phoneNumber: shippingAddressSource.phoneNumber ?? billingAddressSource?.phoneNumber,
            state: shippingAddressSource.state,
            zipCode: shippingAddressSource.zipCode,
          }
          : {
            address1: billingAddressSource?.address1,
            address2: billingAddressSource?.address2,
            city: billingAddressSource?.city,
            country: billingAddressSource?.country ?? '',
            email: billingAddressSource?.email,
            firstName: billingAddressSource?.firstName,
            lastName: billingAddressSource?.lastName,
            phoneNumber: billingAddressSource?.phoneNumber,
            state: billingAddressSource?.state,
            zipCode: billingAddressSource?.zipCode,
          };

        const separateBillingAddress: AddressInput | undefined = billingAddressSource;

        debugLog('requirePaymentIntent:request', {
          paymentMethodId: stripePaymentMethod.id,
          shippingAddress,
          separateBillingAddress,
        });

        const response = await submitPaymentInstructions({
          paymentMethod: stripePaymentMethod.id,
          paymentInitiateOnly: true,
          shippingAddress,
          separateBillingAddress,
          paymentReturnPage: `${window.location.origin}/success`,
          paymentFailedPage: `${window.location.origin}/failed`,
        });

        debugLog('requirePaymentIntent:response', {
          actionType: response.action?.__typename,
          formType:
            response.action?.__typename === 'FormPaymentAction' ? response.action.formType : undefined,
        });

        const stripeConfig = getStripeConfig(response.action);
        debugLog('requirePaymentIntent:stripeConfig', { stripeConfig });
        if (!stripeConfig) {
          debugLog('requirePaymentIntent:invalidConfig', {
            actionType: response.action?.__typename,
          });
          toast.error('Unable to initialize Stripe');
          return null;
        }

        const returnUrl = stripeConfig.stripeParameters.returnUrl ?? `${window.location.origin}/success`;
        debugLog('requirePaymentIntent:success', {
          hasClientSecret: isNonEmptyString(stripeConfig.clientSecret),
          hasPublishableKey: isNonEmptyString(stripeConfig.publishableKey),
          returnUrl,
        });

        return { clientSecret: stripeConfig.clientSecret, returnUrl };
      } catch (error) {
        debugLog('requirePaymentIntent:error', { error });
        toast.error('Unable to initialize Stripe');
        return null;
      }
    },
    [paymentConfig],
  );

  const handleCancelCleanup = useCallback(() => {
    if (addedItemLineRef.current) {
      const lineId = addedItemLineRef.current;
      void updateLine({ id: lineId, quantity: 0 })
        .then(() => {
          addedItemLineRef.current = null;
        })
        .catch((removeError: unknown) => {
          console.error('Failed to remove item from cart:', removeError);
        });
    }
  }, []);

  if (hasSubscriptionItems || disabled) {
    return null;
  }

  if (!paymentConfig || !stripePromise || !elementsCurrency || elementsAmountInMinor <= 0) {
    return null;
  }

  return (
    <Elements
      key={`${publishableKey ?? ''}-${elementsCurrency ?? ''}`}
      stripe={stripePromise}
      options={{
        amount: elementsAmountInMinor,
        captureMethod: elementsCaptureMethod,
        currency: elementsCurrency,
        mode: 'payment',
      }}
    >
      <StripeExpressCheckoutElement
        allowedShippingCountries={isNonEmptyString(allowedShippingCountry) ? [allowedShippingCountry] : []}
        initialLineItems={stripeLineItems}
        onCancel={handleCancelCleanup}
        onEnsureSelectionReady={ensureSelectionReady}
        onRequirePaymentIntent={requirePaymentIntent}
        shippingRates={shippingRates}
      />
    </Elements>
  );
};

export const StripeExpressCheckout = (props: Props) => {
  return (
    <Suspense fallback={null}>
      <ExpressCheckoutErrorBoundary>
        <StripeExpressCheckoutInner {...props} />
      </ExpressCheckoutErrorBoundary>
    </Suspense>
  );
};
