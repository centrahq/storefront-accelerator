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
