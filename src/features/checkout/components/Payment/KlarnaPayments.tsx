import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useId, useState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { checkoutQuery } from '../../queries';

const KLARNA_SDK_SRC = 'https://x.klarnacdn.net/kp/lib/v1/api.js';

// Local Klarna types (more specific than the global 'any' types from @adyen/adyen-web)
interface KlarnaPayments {
  init: (payload: { client_token: string }) => KlarnaPayments;
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
}

type WindowWithKlarna = Omit<Window, 'Klarna' | 'klarnaAsyncCallback'> & {
  Klarna?: {
    Payments: KlarnaPayments;
  };
  klarnaAsyncCallback?: VoidFunction;
};

declare const window: WindowWithKlarna;

export const KlarnaPayments = ({
  authorizePayload,
  clientToken,
}: {
  authorizePayload: unknown;
  clientToken: string;
}) => {
  const router = useRouter();
  const [canAuthorize, setCanAuthorize] = useState(false);
  const containerId = useId();
  const [error, setError] = useState('');
  const { data } = useSuspenseQuery(checkoutQuery);
  const { paymentMethod, widgets } = data.checkout;
  const { t } = useTranslation(['checkout']);

  const klarnaWidget = widgets?.find((widget) => widget.__typename === 'KlarnaPaymentWidget');
  const client_token = klarnaWidget?.client_token ?? clientToken;

  const authorize = () => {
    setError('');

    window.Klarna?.Payments.authorize(
      { payment_method_category: 'klarna' },
      klarnaWidget?.authorizePayload ?? authorizePayload,
      (result) => {
        if (result.approved) {
          router.push(
            `/success?authorization_token=${encodeURIComponent(result.authorization_token)}&centraPaymentMethod=${paymentMethod?.id ?? ''}`,
          );
        } else {
          console.error(result.error);
          setError(t('checkout:payment-failed'));
        }
      },
    );
  };

  useEffect(() => {
    const initKlarnaPayments = () => {
      setCanAuthorize(false);

      window.Klarna?.Payments.init({
        client_token,
      }).load(
        {
          container: `#${CSS.escape(containerId)}`,
          payment_method_category: 'klarna',
        },
        {},
        () => setCanAuthorize(true),
      );
    };

    // Klarna SDK is already loaded
    if (window.Klarna) {
      initKlarnaPayments();
      return;
    }

    // Initialize when SDK is loaded
    window.klarnaAsyncCallback = initKlarnaPayments;

    return () => {
      if (window.klarnaAsyncCallback === initKlarnaPayments) {
        delete window.klarnaAsyncCallback;
      }
    };
  }, [client_token, containerId]);

  return (
    <div className="flex flex-col gap-2">
      <div id={containerId} />
      {error && <p>{error}</p>}
      {canAuthorize ? (
        <button
          type="button"
          className="bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase"
          onClick={authorize}
        >
          {t('checkout:pay-with-klarna')}
        </button>
      ) : (
        <div className="bg-mono-500 h-12 w-full animate-pulse rounded-sm" />
      )}
      <Script src={KLARNA_SDK_SRC} />
    </div>
  );
};
