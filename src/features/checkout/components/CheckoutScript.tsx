'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useEffectEvent } from 'react';

import { UserError } from '@/lib/centra/errors';
import { CentraShippingAddressResponseEvent, CentraShippingMethodResponseEvent } from '@/lib/centra/events';
import { CheckoutEvent, ShippingAddressChangedEvent, ShippingMethodChangedEvent } from '@/lib/centra/types/events';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';
import { SelectionTotalRowType } from '@gql/graphql';

import { useSendWidgetData, useSetAddress, useSetShippingMethod } from '../mutations';
import { checkoutQuery } from '../queries';
import { showItemsRemovedToast } from '../utils/showItemsRemovedToast';
import { Widget } from './Widget';

export const CheckoutScript = () => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { mutate: sendWidgetData } = useSendWidgetData();
  const { mutate: setShippingMethod } = useSetShippingMethod();
  const { mutate: setAddress } = useSetAddress();
  const { totals } = data.checkout;

  const grandTotal = totals.find((total) => total.type === SelectionTotalRowType.GrandTotal)?.price.value;

  useEffect(() => {
    // Expose total price for Qliro One
    window.totalPrice = grandTotal;
  }, [grandTotal]);

  const checkoutCallbackHandler = useEffectEvent((event: CheckoutEvent) => {
    sendWidgetData(event.detail, {
      onSettled: () => {
        window.CentraCheckout?.resume(event.detail.additionalFields?.suspendIgnore);
      },
    });
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    // Redirect widget events to Centra, small debounce to avoid multiple rapid calls.
    const handleCheckoutCallback = (event: CheckoutEvent) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        checkoutCallbackHandler(event);
      }, 0);
    };

    document.addEventListener('centra_checkout_callback', handleCheckoutCallback);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      document.removeEventListener('centra_checkout_callback', handleCheckoutCallback);
    };
  }, []);

  const handleShippingMethodUpdate = useEffectEvent((event: ShippingMethodChangedEvent) => {
    setShippingMethod(Number(event.detail.shippingMethod), {
      onSuccess: (data) => {
        document.dispatchEvent(new CentraShippingMethodResponseEvent(data));
      },
      onError: () => {
        document.dispatchEvent(new CentraShippingMethodResponseEvent(null));
      },
    });
  });

  useEffect(() => {
    // Update the shipping method when a payment widget needs to change it.
    document.addEventListener('centra_checkout_shipping_method_callback', handleShippingMethodUpdate);

    return () => {
      document.removeEventListener('centra_checkout_shipping_method_callback', handleShippingMethodUpdate);
    };
  }, []);

  const handleShippingAddressUpdate = useEffectEvent((event: ShippingAddressChangedEvent) => {
    setAddress(
      {
        shippingAddress: {
          country: event.detail.shippingCountry,
          state: event.detail.shippingState,
          city: event.detail.shippingCity,
          zipCode: event.detail.shippingZipCode,
        },
      },
      {
        onSuccess: (data) => {
          document.dispatchEvent(new CentraShippingAddressResponseEvent(data));
        },
        onError: (error) => {
          document.dispatchEvent(new CentraShippingAddressResponseEvent(null));

          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            showItemsRemovedToast();
          }
        },
      },
    );
  });

  useEffect(() => {
    // Update shipping address when a payment widget needs to change it.
    document.addEventListener('centra_checkout_shipping_address_callback', handleShippingAddressUpdate);

    return () => {
      document.removeEventListener('centra_checkout_shipping_address_callback', handleShippingAddressUpdate);
    };
  }, []);

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
