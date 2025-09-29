import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'About Us',
  openGraph: {
    type: 'article',
  },
};

export default function AboutUsPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">About Us</h1>
        <p>
          Centra&apos;s built-in tools for fashion brands let you serve all markets with the right products, prices, and
          campaigns so you can scale up fast. Centra&apos;s fashion-focused features come out-of-the-box, so your energy
          goes toward growing global sales. Win new markets easily with a single store localized to every country,
          language, currency and more! Here you can read{' '}
          <a href="https://centra.com/case-studies" target="_blank" className="underline underline-offset-2">
            success stories of fashion brands that switched to Centra
          </a>
          !
        </p>
      </div>
    </div>
  );
}
