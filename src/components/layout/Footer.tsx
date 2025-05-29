import { ShopLink } from '@/features/i18n/routing/ShopLink';

// Footer content should be fetched from a CMS in most cases

export const Footer = () => {
  return (
    <footer className="text-mono-300 bleed-bg-mono-900 grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-12 py-10">
      <div className="flex flex-col gap-5 sm:col-span-2">
        <h2 className="text-mono-0 text-xl font-medium">Need help?</h2>
        <p>Our Client Advisors are available Monday through Friday from 8:30am to 5pm EST.</p>
        <div>
          <h3 className="text-mono-0 font-medium">Email us</h3>
          <a href="mailto:help@socksparadise.centra">help@socksparadise.centra</a>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-mono-0 text-xl font-medium">Customer care</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <ShopLink href="/account">My Account</ShopLink>
          </li>
          <li>
            <ShopLink href="/shipping">Shipping</ShopLink>
          </li>
          <li>
            <ShopLink href="/returns">Returns & Exchanges</ShopLink>
          </li>
          <li>
            <ShopLink href="/contact">Contact Us</ShopLink>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-mono-0 text-xl font-medium">Legal</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <ShopLink href="/privacy">Privacy policy</ShopLink>
          </li>
          <li>
            <ShopLink href="/terms">Terms & Conditions</ShopLink>
          </li>
          <li>
            <ShopLink href="/cookies">Cookie Policy</ShopLink>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-mono-0 text-xl font-medium">Company</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <ShopLink href="/about-us">About us</ShopLink>
          </li>
        </ul>
      </div>
    </footer>
  );
};
