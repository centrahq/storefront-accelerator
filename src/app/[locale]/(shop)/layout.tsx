import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CartContextProvider } from '@/features/cart/components/CartContext';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto flex min-h-dvh max-w-[1772px] flex-col gap-3 sm:gap-10">
        <CartContextProvider>
          <Header />
          <main className="flex min-h-[60vh] grow flex-col">{children}</main>
        </CartContextProvider>
        <Footer />
      </div>
    </div>
  );
}
