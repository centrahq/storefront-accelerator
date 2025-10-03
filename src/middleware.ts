import { NextRequest } from 'next/server';

import { routingMiddleware } from '@/features/i18n/routing/middleware';

export default function middleware(request: NextRequest) {
  return routingMiddleware(request);
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)',
};
