import { NextRequest } from 'next/server';

import { routingProxy } from '@/features/i18n/routing/proxy';

export default function proxy(request: NextRequest) {
  return routingProxy(request);
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
};
