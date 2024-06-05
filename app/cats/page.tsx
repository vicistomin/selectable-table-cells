'use client';

import { getCatsPage } from '@/api/cats';
import AGGridTable from '@/components/table/AGGridTable';
import { Breed, Cat, Handler, TableColumn, TableProps } from '@/types';
import { ICellRendererParams, ValueGetterFunc } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const DEFAULT_VALUE = 'n/a';

export default function CatsTablePage() {
  // const
  const agGridRef = useRef<AgGridReact>(null);

  // Helper method to extract Breed info from the Cat object. Always using only 1st breed
  const getBreedFieldValue =
    (field: keyof Breed): ValueGetterFunc<Cat> =>
    (row) =>
      row.data?.breeds?.[0]?.[field] ?? DEFAULT_VALUE;

  const imageRenderer: Handler<ICellRendererParams> = (row) =>
    row.data.url ? (
      <Image width={40} height={40} src={row.data.url} alt={row.data.id} />
    ) : (
      DEFAULT_VALUE
    );

  const columns: TableColumn<Cat>[] = [
    {
      field: 'id',
    },
    {
      headerName: 'Photo',
      cellRenderer: imageRenderer,
    },
    {
      headerName: 'Breed Name',
      valueGetter: getBreedFieldValue('name'),
    },
    {
      headerName: 'Breed Description',
      valueGetter: getBreedFieldValue('description'),
    },
  ];

  const tableProps: TableProps<Cat> = {
    tableName: 'cats',
    columns,
    agGridRef,
    tableDataLoader: getCatsPage,
    defaultOrder: 'DESC',
    pageSize: 10,
  };

  const updateData = () => {
    if (!!agGridRef.current && !!agGridRef.current.api) {
      agGridRef.current.api.showLoadingOverlay();
      agGridRef.current.api.refreshServerSide();
    }
  };

  return (
    <div className="grid h-full" style={{ gridTemplateRows: '15% 85%' }}>
      <div className="flex justify-between items-center gap-4">
        <Link
          href="/"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="text-2xl font-semibold">
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &lt;-
            </span>{' '}
            Go back
          </h2>
        </Link>
        <button
          onClick={updateData}
          className="bg-sky-500 hover:bg-sky-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white"
        >
          Refresh table
        </button>
      </div>
      <AGGridTable<Cat> {...tableProps} />
    </div>
  );
}
