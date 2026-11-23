import { createStandardExpressCheckoutOperations } from '@centra/storefront-operations/express-checkout';
import { createStandardPaymentOperations } from '@centra/storefront-operations/payment';

import { centraRequest } from '@/lib/centra/storefront-api/fetchers/centraRequest';

/**
 * Centra's payment and express-checkout calls, as the `@centra/stripe-react` and `@centra/adyen-react` surfaces make
 * them. Their documents ship with `@centra/storefront-operations`, so the store writes none of its own for payments.
 */
export const paymentOperations = createStandardPaymentOperations(centraRequest);

export const expressCheckoutOperations = createStandardExpressCheckoutOperations(centraRequest);
