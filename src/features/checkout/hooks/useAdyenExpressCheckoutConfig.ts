'use client';

import { useMemo } from 'react';

interface AdyenConfig {
  expressCheckoutEnabled: boolean;
}

export function useAdyenExpressCheckoutConfig(): { adyenConfig: AdyenConfig } {
  const adyenConfig = useMemo<AdyenConfig>(() => {
    // Check if express checkout is enabled via environment variable or feature flag
    const enabled = process.env.NEXT_PUBLIC_ADYEN_EXPRESS_CHECKOUT_ENABLED === 'true';

    return {
      expressCheckoutEnabled: enabled,
    };
  }, []);

  return { adyenConfig };
}
