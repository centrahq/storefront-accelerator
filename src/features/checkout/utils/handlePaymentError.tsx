import { toast } from 'sonner';

import { Translation } from '@/features/i18n';
import { UserError } from '@/lib/centra/errors';
import { PaymentInstructionsMutation } from '@gql/graphql';

export const handlePaymentError = (error: Error) => {
  const hasUnavailableItems =
    error instanceof UserError &&
    (error.userErrors as PaymentInstructionsMutation['paymentInstructions']['userErrors']).some(
      (err) => err.__typename === 'UnavailableItem',
    );

  if (hasUnavailableItems) {
    toast.error(<Translation>{(t) => t('checkout:errors.unavailable-items.title')}</Translation>, {
      id: 'payment-error',
      duration: Infinity,
      closeButton: true,
      description: <Translation>{(t) => t('checkout:errors.unavailable-items.message')}</Translation>,
    });
  } else {
    toast.error(<Translation>{(t) => t('checkout:errors.could-not-finalize-payment')}</Translation>, {
      id: 'payment-error',
    });
  }
};
