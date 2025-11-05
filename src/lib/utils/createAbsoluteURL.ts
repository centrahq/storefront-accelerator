export function createAbsoluteURL(path: string): string {
  if (typeof window === 'undefined') {
    return path;
  }
  
  const { protocol, host } = window.location;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${protocol}//${host}${normalizedPath}`;
}

