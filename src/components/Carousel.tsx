'use client';

import clsx from 'clsx';
import useCarousel from 'embla-carousel-react';
import { Children, useEffect, useState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

export const Carousel = ({ children }: { children: React.ReactNode }) => {
  const [carouselRef, carouselApi] = useCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { t } = useTranslation(['shop']);

  useEffect(() => {
    carouselApi
      ?.on('reInit', (api) => {
        setScrollSnaps(api.scrollSnapList());
        setSelectedIndex(api.selectedScrollSnap());
      })
      .on('select', (api) => {
        setSelectedIndex(api.selectedScrollSnap());
      })
      .emit('reInit');
  }, [carouselApi]);

  return (
    <section>
      <div className="overflow-hidden" ref={carouselRef}>
        <div className="-ml-2 flex touch-pan-y touch-pinch-zoom">
          {Children.map(children, (child, index) => {
            return (
              <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full transform-gpu pl-4 select-none" key={index}>
                {child}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => carouselApi?.scrollTo(index)}
            className={clsx({
              'text-mono-600': index === selectedIndex,
              'text-mono-300': index !== selectedIndex,
            })}
          >
            <span className="sr-only">{t('shop:go-to-slide', { index: index + 1 })}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
};
