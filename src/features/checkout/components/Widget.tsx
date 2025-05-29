'use client';

import { useLayoutEffect, useRef } from 'react';

export const Widget = ({ html, cleanUp }: { html: string; cleanUp?: VoidFunction }) => {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const triggeredHtmlRef = useRef<string | null>(null);
  const cleanUpRef = useRef(cleanUp);

  useLayoutEffect(() => {
    cleanUpRef.current = cleanUp;
  }, [cleanUp]);

  useLayoutEffect(() => {
    // Prevent double run on strict mode
    if (triggeredHtmlRef.current === html) {
      return;
    }

    cleanUpRef.current?.();

    const widget = widgetRef.current;

    if (widget) {
      widget.innerHTML = '';
      // Insert and run scripts in the html
      widget.appendChild(document.createRange().createContextualFragment(html));
      triggeredHtmlRef.current = html;
    }
  }, [html]);

  return <div ref={widgetRef} className="contents" />;
};
