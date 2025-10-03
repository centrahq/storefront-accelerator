export const ProductGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4 2xl:grid-cols-4 2xl:gap-8">{children}</ul>
  );
};
