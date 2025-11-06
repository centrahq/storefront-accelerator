'use client';

import { createContext, ReactNode, useState } from 'react';

import { WatchPathname } from '@/components/WatchPathname';

export const CartContext = createContext<{ isCartOpen: boolean; setIsCartOpen: (open: boolean) => void }>({
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <CartContext value={{ isCartOpen, setIsCartOpen }}>{children}</CartContext>
      <WatchPathname onChange={() => setIsCartOpen(false)} />
    </>
  );
};
