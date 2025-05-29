'use client';

import clsx from 'clsx';
import { default as NextLink } from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export const ShopLink = ({ href, ...props }: ComponentProps<typeof NextLink> & { href: string }) => {
  const params = useParams<{ locale: string }>();

  return <NextLink {...props} href={`/${params.locale}${href}`} />;
};

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
