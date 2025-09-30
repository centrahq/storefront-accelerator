'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

const Lightbox = dynamic(() => import('./Lightbox'));

interface Props {
  media: Array<{
    id: number;
    altText?: string | null;
    source: {
      url: string;
    };
  }>;
}

export const ProductMedia = ({ media }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (!media[0]) {
    return null;
  }

  return (
    <>
      <div className="flex h-full gap-6 overflow-x-auto max-md:h-[40vh] md:flex-col">
        <div className="relative aspect-3/4 w-full">
          <button type="button" onClick={() => setLightboxIndex(0)}>
            <span className="sr-only">Zoom in</span>
            <Image
              src={media[0].source.url}
              alt={media[0].altText ?? ''}
              className="object-cover"
              priority
              fill
              sizes="(min-width: 1800px) 848px, (min-width: 768px) 45vw, 30vh"
              fetchPriority="high"
            />
          </button>
        </div>
        {media.length > 1 && (
          <div className="contents md:grid md:grid-cols-2 md:gap-6">
            {media.slice(1).map((medium, index) => (
              <div key={medium.id} className="relative aspect-3/4 md:aspect-square">
                <button type="button" onClick={() => setLightboxIndex(index + 1)}>
                  <span className="sr-only">Zoom in</span>
                  <Image
                    src={medium.source.url}
                    alt={medium.altText ?? ''}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1800px) 412px, (min-width: 768px) 22vw, 30vh"
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Lightbox
        index={lightboxIndex}
        slides={media.map((medium) => ({ src: medium.source.url, alt: medium.altText ?? '' }))}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
      />
    </>
  );
};
