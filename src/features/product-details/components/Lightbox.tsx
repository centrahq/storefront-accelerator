import LightboxComponent, { LightboxExternalProps } from 'yet-another-react-lightbox';

import 'yet-another-react-lightbox/styles.css';

export default function Lightbox({ slides, ...props }: Omit<LightboxExternalProps, 'plugins'>) {
  return (
    <LightboxComponent
      slides={slides?.map((slide) => ({
        // This must be updated if the breakpoints or image loader are modified.
        src: `/_next/image?url=${encodeURIComponent(slide.src)}&w=1200&q=75`,
        alt: slide.alt,
      }))}
      {...props}
    />
  );
}
