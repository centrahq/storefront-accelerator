'use client';

import { useLayoutEffect, useRef } from 'react';

export const Widget = ({
  html,
  cleanUp,
  onMount,
}: {
  html: string;
  cleanUp?: VoidFunction;
  onMount?: VoidFunction;
}) => {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const triggeredHtmlRef = useRef<string | null>(null);
  const cleanUpRef = useRef(cleanUp);
  const onMountRef = useRef(onMount);

  useLayoutEffect(() => {
    cleanUpRef.current = cleanUp;
    onMountRef.current = onMount;
  }, [cleanUp, onMount]);

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
      onMountRef.current?.();
      triggeredHtmlRef.current = html;
    }
  }, [html]);

  return <div ref={widgetRef} className="contents" />;
};
