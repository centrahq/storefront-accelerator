import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  openGraph: {
    type: 'article',
  },
};

export default function TermsPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">Terms & Conditions</h1>
        <p>
          Terms & Conditions (**Demo Only**): This is a sample Terms & Conditions statement provided for demonstration purposes and does not represent a legally binding agreement. In a real webshop, this section would describe the rules for using the site, purchasing products, processing payments, handling deliveries, and addressing returns or refunds. It would also outline user responsibilities, limitations of liability, and applicable governing laws. Please replace this placeholder with properly drafted and legally reviewed terms before launching a live website.
        </p>
      </div>
    </div>
  );
}
