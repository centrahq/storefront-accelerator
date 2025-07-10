'use client';

import clsx from 'clsx';
import { default as NextLink } from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

/**
 * Link component that automatically prepends the current locale to the href.
 */
export const ShopLink = ({ href, ...props }: ComponentProps<typeof NextLink> & { href: string }) => {
  const params = useParams<{ locale: string }>();

  return <NextLink {...props} href={`/${params.locale}${href}`} />;
};

/**
 * Link component that automatically prepends the current locale to the href
 * and applies an active class name if the link is currently active.
 */
export const NavLink = ({
  className,
  activeClassName,
  ...props
}: ComponentProps<typeof ShopLink> & { activeClassName: string }) => {
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const path = `/${params.locale}${props.href}`;
  const isActive = pathname === path || `${pathname}/` === path;

  return <ShopLink {...props} className={clsx(className, isActive && activeClassName)} />;
};
