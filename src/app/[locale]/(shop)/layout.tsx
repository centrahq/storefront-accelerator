import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CartContextProvider } from '@/features/cart/components/CartContext';
import { localeParam } from '@/features/i18n/routing/localeParam';

export default async function ShopLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  localeParam.parse((await props.params).locale);

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto flex min-h-dvh max-w-[1772px] flex-col gap-3 sm:gap-10">
        <CartContextProvider>
          <Header />
          <main className="flex min-h-[60vh] grow flex-col">{props.children}</main>
        </CartContextProvider>
        <Footer />
      </div>
    </div>
  );
}
