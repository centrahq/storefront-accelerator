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
