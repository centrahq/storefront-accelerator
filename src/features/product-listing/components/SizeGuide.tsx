'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMemo, useState } from 'react';

export const SizeGuide = ({ sizeGuideTableJson }: { sizeGuideTableJson: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeGuideTable = useMemo(() => JSON.parse(sizeGuideTableJson) as string[][], [sizeGuideTableJson]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-sm font-medium underline underline-offset-2">
        Size measurement
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/70" />
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="flex max-w-2xl min-w-md flex-col gap-4 border bg-white p-8">
              <DialogTitle className="font-bold">Size measurement</DialogTitle>
              <table className="text-mono-900 w-full text-left text-sm">
                <thead className="bg-mono-200 text-mono-600 text-xs uppercase">
                  <tr>
                    {sizeGuideTable[0]?.map((header, index) => (
                      <th key={index} className="px-6 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideTable.slice(1).map((row, index) => (
                    <tr key={index} className="bg-mono-0 border-b last:border-none">
                      {row[0] && (
                        <th className="px-6 py-4 font-medium" scope="row">
                          {row[0]}
                        </th>
                      )}
                      {row.slice(1).map((cell, index) => (
                        <td key={index} className="px-6 py-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end gap-4">
                <button onClick={() => setIsOpen(false)}>Close</button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
