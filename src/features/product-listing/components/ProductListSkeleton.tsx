import { ProductGridSkeleton } from './ProductGridSkeleton';

export const ProductListSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-10">
    <div className="flex flex-wrap justify-between">
      <div className="bg-mono-500 h-10 w-80 rounded-sm" />
      <div className="bg-mono-500 my-2 ml-auto h-8 w-56 rounded-sm" />
    </div>
    <ProductGridSkeleton />
  </div>
);
