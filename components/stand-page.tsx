'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export function ClientStand({ periods }: { periods: any[] }) {
  const [index, setIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const period = periods[index];

  const data = useMemo(() => {
    return period.lines.map((line: any) => {
      const inbound = line.transactions
        .filter((t: any) => t.type === 'INBOUND')
        .reduce((sum: number, t: any) => sum + Number(t.quantity), 0);
      const outbound = line.transactions
        .filter((t: any) => t.type === 'OUTBOUND')
        .reduce((sum: number, t: any) => sum + Number(t.quantity), 0);
      const total = Number(line.openingQuantity) + inbound - outbound;
      const closing = Number(line.closingQuantity ?? 0);
      const reduction = total - closing;
      const unitPrice = line.sellingUnitPrice ?? 0;

      return {
        name: line.product.name,
        sellingUnitPrice: unitPrice,
        opening: +line.openingQuantity,
        inbound,
        outbound,
        total,
        closing,
        reduction,
        value: reduction * unitPrice,
      };
    });
  }, [period]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: 'name', header: 'Termék' },
      { accessorKey: 'sellingUnitPrice', header: 'Éttermi ár' },
      { accessorKey: 'opening', header: 'Nyitó' },
      { accessorKey: 'inbound', header: 'Bev.' },
      { accessorKey: 'outbound', header: 'Kiv.' },
      { accessorKey: 'total', header: 'Összesen' },
      { accessorKey: 'closing', header: 'Záró' },
      { accessorKey: 'reduction', header: 'Fogyás' },
      {
        accessorKey: 'value',
        header: 'Érték',
        cell: (info) => `${(info.getValue() as number).toLocaleString()} Ft`,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handlePrev = () => setIndex((i) => Math.min(i + 1, periods.length - 1));
  const handleNext = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <button onClick={handlePrev} disabled={index === periods.length - 1}>
          ⬅ Előző
        </button>
        <h1>
          Stand – {period.year}.{String(period.month).padStart(2, '0')}
        </h1>
        <button onClick={handleNext} disabled={index === 0}>
          Következő ➡
        </button>
      </div>

      <input
        type='text'
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder='🔍 Keresés...'
        className='mb-4 p-2 border rounded'
      />

      <table className='min-w-full border-collapse border'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='bg-gray-100'>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className='cursor-pointer px-3 py-2 border'
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className='odd:bg-white even:bg-gray-50'>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-3 py-2 border'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
