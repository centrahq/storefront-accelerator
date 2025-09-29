import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  openGraph: {
    type: 'article',
  },
};

export default function ReturnsPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">Returns & Exchanges</h1>
        <p>
          We want you to be completely satisfied with your purchase. If you are not happy with your order, you may request a return or exchange within 14 days of receiving your items, provided they are unused, in their original packaging, and in resalable condition. To initiate a return or exchange, please contact our customer support team with your order details. Approved returns will be refunded to the original payment method within 7–10 business days after we receive and inspect the item(s). Please note that return shipping costs are the responsibility of the customer unless the item is defective or incorrect. Certain items, such as personalized products or final sale items, may not be eligible for return or exchange.
        </p>
      </div>
    </div>
  );
}
