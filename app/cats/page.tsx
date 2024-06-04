'use client';

import AGGridTable from '@/components/table/AGGridTable';
import { Entity, TableColumn, TableLoader } from '@/types';
import { AgGridReact } from 'ag-grid-react';
import Link from 'next/link';
import { useRef } from 'react';

export type Cat = Entity & { title: string };

export default function CatsTablePage() {
  const agGridRef = useRef<AgGridReact>(null);

  const columns: TableColumn<Cat>[] = [
    {
      field: 'id',
    },
    {
      field: 'title',
    },
  ];

  const tableDataLoader: TableLoader<Cat> = (pageQuery) => {
    console.log('new API request', { pageQuery });
    return Promise.resolve([
      { id: 1, title: 'test' + Math.floor(Math.random() * 10) },
      { id: 2, title: 'test' + Math.floor(Math.random() * 10) },
      { id: 3, title: 'test' + Math.floor(Math.random() * 10) },
    ]);
  };

  const tableProps = {
    tableName: 'cats',
    columns,
    agGridRef,
    tableDataLoader,
    // catsApi.getAll(pageQuery.page, pageQuery.size),
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
