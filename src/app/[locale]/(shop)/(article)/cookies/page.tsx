import type { Metadata } from 'next';

// Placeholder for the actual page content, which would typically be fetched from a CMS

export const metadata: Metadata = {
  title: 'Cookie Policy',
  openGraph: {
    type: 'article',
  },
};

export default function CookiesPage() {
  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">Cookie Policy</h1>
        <p>
          Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and support essential site functions such as remembering your preferences and enabling secure logins. By continuing to use our site, you consent to the use of cookies in accordance with this policy. You can manage or disable cookies at any time through your browser settings, but please note that certain features of the site may not function properly if cookies are disabled. For more information on how we use cookies and how your data is handled, please refer to our Privacy Policy.
        </p>
      </div>
    </div>
  );
}
