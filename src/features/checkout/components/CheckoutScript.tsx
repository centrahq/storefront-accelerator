'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { CentraShippingAddressResponseEvent, CentraShippingMethodResponseEvent } from '@/lib/centra/events';
import { CheckoutEvent, ShippingAddressChangedEvent, ShippingMethodChangedEvent } from '@/lib/centra/types/events';
import { SelectionTotalRowType } from '@gql/graphql';

import { useSendWidgetData, useSetCountryState, useSetShippingMethod } from '../mutations';
import { checkoutQuery } from '../queries';
import { Widget } from './Widget';

export const CheckoutScript = () => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { mutate: sendWidgetData } = useSendWidgetData();
  const { mutate: setShippingMethod } = useSetShippingMethod();
  const { mutate: setCountryState } = useSetCountryState();
  const { totals } = data.checkout;

  const grandTotal = totals.find((total) => total.type === SelectionTotalRowType.GrandTotal)?.price.value;

  useEffect(() => {
    // Expose total price for Qliro One
    window.totalPrice = grandTotal;
  }, [grandTotal]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    // Redirect widget events to Centra, small debounce to avoid multiple rapid calls.
    const handleCheckoutCallback = (event: CheckoutEvent) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        sendWidgetData(event.detail, {
          onSettled: () => {
            window.CentraCheckout?.resume(event.detail.additionalFields?.suspendIgnore);
          },
        });
        timeout = null;
      }, 0);
    };

    document.addEventListener('centra_checkout_callback', handleCheckoutCallback);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      document.removeEventListener('centra_checkout_callback', handleCheckoutCallback);
    };
  }, [sendWidgetData]);

  useEffect(() => {
    // Update the shipping method when a payment widget wants to change it.
    const handleShippingMethodUpdate = ({ detail }: ShippingMethodChangedEvent) => {
      setShippingMethod(Number(detail.shippingMethod), {
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
  }, [setShippingMethod]);

  useEffect(() => {
    // Update the country and state when a payment widget wants to change them.
    const handleShippingAddressUpdate = ({ detail }: ShippingAddressChangedEvent) => {
      setCountryState(
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
  }, [setCountryState]);

  if (data.checkout.checkoutScript) {
    return (
      <Widget
        html={`<script>${data.checkout.checkoutScript}</script>`}
        cleanUp={() => {
          window.CentraCheckout?.destroy();
        }}
      />
    );
  }
};
