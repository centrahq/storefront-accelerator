import { usePathname } from 'next/navigation';
import { useEffect, useEffectEvent, useRef } from 'react';

export const WatchPathname = ({ onChange }: { onChange: (pathname: string, prevPathname: string) => void }) => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const onPathnameChange = useEffectEvent(onChange);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      onPathnameChange(pathname, prevPathname.current);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null;
};
