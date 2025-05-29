export interface EventAddress {
  country: string;
  state?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  phoneNumber?: string;
  company?: string;
  vatNumber?: string;
}

export type PaymentPayload = {
  responseEventRequired?: boolean;
  paymentMethod: string | number;
  paymentMethodSpecificFields: Record<string, unknown>;
} & (
  | {
      addressIncluded: true;
      shippingAddress: EventAddress;
      billingAddress: EventAddress;
    }
  | { addressIncluded: false }
);

export type ShippingMethodChangedPayload = {
  shippingMethod: string;
};

export type ShippingAddressChangedPayload = {
  shippingCountry: string;
  shippingState: string;
  shippingZipCode: string | undefined;
};

export type ShippingMethodChangedEvent = CustomEvent<ShippingMethodChangedPayload>;
export type ShippingAddressChangedEvent = CustomEvent<ShippingAddressChangedPayload>;
export type PaymentEvent = CustomEvent<PaymentPayload>;
export type CheckoutEvent = CustomEvent<Record<string, unknown> & { additionalFields?: { suspendIgnore?: unknown } }>;
