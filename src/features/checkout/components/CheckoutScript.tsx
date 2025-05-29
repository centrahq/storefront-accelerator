'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { CentraShippingAddressResponseEvent, CentraShippingMethodResponseEvent } from '@/lib/centra/events';
import { CheckoutEvent, ShippingAddressChangedEvent, ShippingMethodChangedEvent } from '@/lib/centra/types/events';
import { SelectionTotalRowType } from '@gql/graphql';

import { useSendWidgetData, useSetCountryState, useSetShippingMethod } from '../mutations';
import { checkoutQuery } from '../queries';
import { Widget } from './Widget';

export const CheckoutScript = () => {
  const isInitialized = useRef(false);
  const { data } = useSuspenseQuery(checkoutQuery);
  const sendWidgetDataMutation = useSendWidgetData();
  const setShippingMethodMutation = useSetShippingMethod();
  const setCountryStateMutation = useSetCountryState();
  const { totals } = data.checkout;

  const grandTotal = totals.find((total) => total.type === SelectionTotalRowType.GrandTotal)?.price.value;

  useEffect(() => {
    // Expose total price for Qliro One
    window.totalPrice = grandTotal;
  }, [grandTotal]);

  useEffect(() => {
    // Redirect widget events to Centra
    const handleCheckoutCallback = (event: CheckoutEvent) => {
      sendWidgetDataMutation.mutate(event.detail, {
        onSettled: () => {
          window.CentraCheckout?.resume(event.detail.additionalFields?.suspendIgnore);
        },
      });
    };

    document.addEventListener('centra_checkout_callback', handleCheckoutCallback);

    return () => {
      document.removeEventListener('centra_checkout_callback', handleCheckoutCallback);
    };
  }, [sendWidgetDataMutation]);

  useEffect(() => {
    // Update the shipping method when a payment widget wants to change it.
    const handleShippingMethodUpdate = ({ detail }: ShippingMethodChangedEvent) => {
      setShippingMethodMutation.mutate(Number(detail.shippingMethod), {
        onSuccess: (data) => {
          document.dispatchEvent(new CentraShippingMethodResponseEvent(data));
        },
        onError: () => {
          document.dispatchEvent(new CentraShippingMethodResponseEvent(null));
        },
      });
    };

    document.addEventListener('centra_checkout_shipping_method_callback', handleShippingMethodUpdate);

    return () => {
      document.removeEventListener('centra_checkout_shipping_method_callback', handleShippingMethodUpdate);
    };
  }, [setShippingMethodMutation]);

  useEffect(() => {
    // Update the country and state when a payment widget wants to change them.
    const handleShippingAddressUpdate = ({ detail }: ShippingAddressChangedEvent) => {
      setCountryStateMutation.mutate(
        {
          countryCode: detail.shippingCountry,
          stateCode: detail.shippingState,
        },
        {
          onSuccess: (data) => {
            document.dispatchEvent(new CentraShippingAddressResponseEvent(data));
          },
          onError: () => {
            document.dispatchEvent(new CentraShippingAddressResponseEvent(null));
          },
        },
      );
    };

    document.addEventListener('centra_checkout_shipping_address_callback', handleShippingAddressUpdate);

    return () => {
      document.removeEventListener('centra_checkout_shipping_address_callback', handleShippingAddressUpdate);
    };
  }, [setCountryStateMutation]);

  useEffect(() => {
    // Prevent double run on strict mode
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    return () => {
      window.CentraCheckout?.destroy();
    };
  }, []);

  if (data.checkout.checkoutScript) {
    return <Widget html={`<script>${data.checkout.checkoutScript}</script>`} />;
  }
};
