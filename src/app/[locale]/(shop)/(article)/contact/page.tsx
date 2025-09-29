import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'Contact Us',
  openGraph: {
    type: 'article',
  },
};

export default function ContactPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">Contact Us</h1>
        <p>
          If you're a partner looking for documentation, start on [centra.dev - our portal for developers](https://centra.dev)!

          If you're new, why not [sign up for a demo](https://centra.com/demo)?

          If you're looking to contact Centra in general, please see [our contact page](https://centra.com/contact).
        </p>
      </div>
    </div>
  );
}
