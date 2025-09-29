import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'Privacy Policy',
  openGraph: {
    type: 'article',
  },
};

export default function PrivacyPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">Privacy Policy</h1>
        <p>
          Privacy Policy (**Demo Only**!): This is a sample privacy policy for demonstration purposes only and does not constitute a legally binding agreement. In a real webshop, this section would explain how customer data (such as names, email addresses, and payment details) is collected, stored, and used, as well as outline any third-party services involved in processing transactions. It would also inform users of their rights regarding their personal information, including how to request updates or deletion. Please replace this placeholder with a proper, legally reviewed privacy policy before launching a live website.
        </p>
      </div>
    </div>
  );
}
