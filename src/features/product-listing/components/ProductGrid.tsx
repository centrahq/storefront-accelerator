export const ProductGrid = ({ children }: { children: React.ReactNode }) => {
  return <ul className="grid grid-cols-1 gap-8 sm:grid-cols-[repeat(auto-fill,minmax(25rem,1fr))]">{children}</ul>;
};
