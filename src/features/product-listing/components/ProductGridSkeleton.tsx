export const ProductGridSkeleton = () => {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(25rem,1fr))] gap-10">
      {Array.from(Array(24), (_, index) => (
        <li key={index} className="relative flex animate-pulse flex-col">
          <div className="bg-mono-500 aspect-23/20 grow" />
          <div className="bg-mono-0 px-4 py-3">
            <div className="bg-mono-500 mb-2 h-4 w-1/2 rounded-sm" />
            <div className="bg-mono-500 h-4 w-1/3 rounded-sm" />
          </div>
        </li>
      ))}
    </ul>
  );
};
