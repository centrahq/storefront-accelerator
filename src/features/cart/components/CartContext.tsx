'use client';

import { usePathname } from 'next/navigation';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const CartContext = createContext<{ isCartOpen: boolean; setIsCartOpen: (open: boolean) => void }>({
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close the cart when navigating to a different page
    setIsCartOpen(false);
  }, [pathname]);

  return <CartContext value={{ isCartOpen, setIsCartOpen }}>{children}</CartContext>;
};
