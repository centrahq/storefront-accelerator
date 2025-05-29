'use client';

import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

export const NavMenuPanel = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation(['shop']);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <Bars3Icon className="size-8" />
        <span className="sr-only">{t('shop:show-menu')}</span>
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-xs duration-300 ease-out data-closed:bg-transparent data-closed:backdrop-blur-none"
        />
        <DialogPanel
          transition
          className="bg-mono-0 fixed inset-y-0 left-0 size-full translate-x-0 overflow-auto duration-300 ease-out data-closed:-translate-x-full md:w-[30rem]"
        >
          <CloseButton className="absolute top-4 right-4">
            <XMarkIcon className="size-6" />
            <span className="sr-only">{t('shop:common.close')}</span>
          </CloseButton>
          <div className="flex min-h-full flex-col gap-5 p-10">
            <DialogTitle className="sr-only text-3xl font-medium">{t('shop:menu')}</DialogTitle>
            {children}
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};
