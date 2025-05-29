import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

// Placeholder for the actual page content, which would be fetched from a CMS
const PAGES: Record<string, string> = {
  'terms': 'Terms & Conditions',
  'shipping': 'Shipping',
  'returns': 'Returns & Exchanges',
  'contact': 'Contact Us',
  'privacy': 'Privacy Policy',
  'cookies': 'Cookie Policy',
  'about-us': 'About Us',
};

export async function generateMetadata(props: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const params = await props.params;
  const title = PAGES[params.page];

  if (!title) {
    return notFound();
  }

  return {
    title,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe quod provident quisquam vel aliquid.',
    openGraph: {
      type: 'article',
    },
  };
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const title = PAGES[params.page];

  if (!title) {
    return notFound();
  }

  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-4xl font-medium">{title}</h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero voluptates sint mollitia hic corrupti autem
          enim, omnis qui provident officia dolorem deserunt itaque iste temporibus ratione nesciunt doloremque dolorum
          molestiae vero, ullam, assumenda fugit dolore veniam? Similique, aliquam. Molestiae dicta exercitationem
          veritatis error nulla eum atque, fugit impedit sint ut libero vitae perspiciatis quibusdam aliquid aspernatur
          fugiat repudiandae eligendi enim magni blanditiis iusto ab illum modi a. Enim architecto eligendi dignissimos
          quos excepturi. Dolores eius odio molestias voluptatibus alias autem dolorum? Autem non sed earum eveniet vero
          ducimus, placeat veniam ipsum ipsa dignissimos illo est excepturi cupiditate deserunt totam quidem?
        </p>
      </div>
    </div>
  );
}
