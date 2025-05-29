import 'i18next';

import checkoutNS from './locales/en/checkout.json';
import serverNS from './locales/en/server.json';
import shopNS from './locales/en/shop.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: [];
    resources: {
      server: typeof serverNS;
      checkout: typeof checkoutNS;
      shop: typeof shopNS;
    };
  }
}
