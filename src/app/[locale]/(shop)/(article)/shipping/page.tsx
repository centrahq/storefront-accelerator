import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'Shipping',
  openGraph: {
    type: 'article',
  },
};

export default function ShippingPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">Shipping</h1>
        <p>
          We offer standard shipping to supported countries, with orders typically processed within 1-2 business days
          and delivered within 3-7 business days, depending on your location. Shipping costs are calculated at checkout
          and vary based on order weight and destination. Once your order has been shipped, you will receive a
          confirmation email with tracking information. While we strive to meet estimated delivery times, delays may
          occur due to factors beyond our control, such as carrier delays or customs processing. We are not responsible
          for lost or stolen packages marked as delivered, and recommend ensuring your shipping address is accurate and
          secure at the time of purchase.
        </p>
      </div>
    </div>
  );
}
