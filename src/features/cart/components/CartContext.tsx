'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export const CartContext = createContext<{ isCartOpen: boolean; setIsCartOpen: Dispatch<SetStateAction<boolean>> }>({
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return <CartContext value={{ isCartOpen, setIsCartOpen }}>{children}</CartContext>;
};
