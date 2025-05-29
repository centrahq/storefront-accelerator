import { PaginationSkeleton } from '@/components/Pagination';

import { ORDER_LIMIT } from '../orderListConfig';

export const OrdersSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="relative animate-pulse overflow-x-auto">
        <table className="w-full">
          <thead className="bg-mono-200">
            <tr>
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="bg-mono-600 h-4 rounded-sm" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ORDER_LIMIT }).map((_, index) => (
              <tr key={index} className="bg-mono-0 border-b last:border-none">
                {Array.from({ length: 6 }).map((_, index) => (
                  <td key={index} className="px-6 py-4">
                    <div className="bg-mono-500 h-5 w-full rounded-sm" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ml-auto">
        <PaginationSkeleton />
      </div>
    </div>
  );
};
