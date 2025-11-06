'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

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

  const mountHandler = useEffectEvent(() => onMount?.());
  const cleanUpHandler = useEffectEvent(() => cleanUp?.());

  useEffect(() => {
    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    widget.innerHTML = '';
    widget.appendChild(document.createRange().createContextualFragment(html));
    mountHandler();

    return () => {
      cleanUpHandler();
    };
  }, [html]);

  return <div ref={widgetRef} className="contents" />;
};
