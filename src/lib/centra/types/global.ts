import type { Env } from '@/config/env';

import type { CheckoutEvent, PaymentEvent, ShippingAddressChangedEvent, ShippingMethodChangedEvent } from './events';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }

  interface Window {
    CentraCheckout?: {
      suspend: (...args: unknown[]) => void;
      resume: (...args: unknown[]) => void;
      reInitiate: (handler: 'ingrid' | (string & {})) => void;
      destroy: VoidFunction;
    };
    // Ingrid/Shipwallet
    _sw?: (callback: (api: { destroy?: VoidFunction }) => void) => void;
    // Klarna payments
    Klarna?: {
      Payments: {
        init: (payload: { client_token: string }) => NonNullable<typeof window.Klarna>['Payments'];
        load: (
          payload: { container: string; payment_method_category: string },
          _: unknown,
          onLoad: VoidFunction,
        ) => void;
        authorize: (
          payload: { payment_method_category: string },
          authorizePayload: unknown,
          callback?: (
            result:
              | {
                  approved: true;
                  authorization_token: string;
                }
              | { approved: false; error: unknown },
          ) => void,
        ) => void;
      };
    };
    klarnaAsyncCallback?: VoidFunction;
    // Qliro One
    totalPrice?: number;
  }

  interface DocumentEventMap {
    centra_checkout_callback: CheckoutEvent;
    centra_checkout_payment_callback: PaymentEvent;
    centra_checkout_shipping_method_callback: ShippingMethodChangedEvent;
    centra_checkout_shipping_address_callback: ShippingAddressChangedEvent;
  }
}
