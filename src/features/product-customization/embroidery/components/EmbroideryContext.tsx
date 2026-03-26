'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

export const EmbroideryContext = createContext<{
  embroideryText: string;
  setEmbroideryText: (text: string) => void;
} | null>(null);

export const useEmbroidery = () => {
  const context = useContext(EmbroideryContext);

  if (!context) {
    throw new Error('useEmbroidery must be used within an EmbroideryContextProvider');
  }

  return context;
};

export const EmbroideryContextProvider = ({ children }: { children: ReactNode }) => {
  const [embroideryText, setEmbroideryText] = useState('');

  return <EmbroideryContext value={{ embroideryText, setEmbroideryText }}>{children}</EmbroideryContext>;
};
