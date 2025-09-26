export const SubscriptionsSkeleton = () => {
  return (
    <div className="relative animate-pulse overflow-x-auto">
      <table className="w-full">
        <thead className="bg-mono-200">
          <tr>
            {Array.from({ length: 4 }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <div className="bg-mono-600 h-4 rounded-sm" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="bg-mono-0 border-b last:border-none">
              {Array.from({ length: 4 }).map((_, index) => (
                <td key={index} className="px-6 py-4">
                  <div className="bg-mono-500 h-5 w-full rounded-sm" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
