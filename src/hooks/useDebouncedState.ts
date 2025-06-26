import { useEffect, useRef, useState } from 'react';

export const useDebouncedState = <T>(
  value: T,
  onCommit: (val: T) => void,
  {
    delay = 500,
  }: {
    delay?: number;
  } = {},
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localValue, setLocalValue] = useState<T | null>(null);

  const setValue = (newVal: T) => {
    setLocalValue(newVal);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newVal !== value) {
      timeoutRef.current = setTimeout(() => {
        onCommit(newVal);
        timeoutRef.current = null;
        setLocalValue(null);
      }, delay);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [localValue ?? value, setValue] as const;
};
