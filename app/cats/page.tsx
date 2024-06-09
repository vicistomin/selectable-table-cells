'use client';

import { getCatsPage } from '@/api/cats';
import AGGridTable from '@/components/table/AGGridTable';
import { Breed, Cat, Handler, TableProps } from '@/types';
import {
  ColDef,
  ICellRendererParams,
  ValueGetterFunc,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { randomCatName } from 'cat-names';
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
    (row) => {
      if (field === 'weight')
        return row.data?.breeds?.[0]?.weight?.metric ?? DEFAULT_VALUE;
      else return row.data?.breeds?.[0]?.[field] ?? DEFAULT_VALUE;
    };

  const imageRenderer: Handler<ICellRendererParams> = (row) =>
    row.data.url ? (
      <div className="flex items-center h-full">
        <Image width={40} height={40} src={row.data.url} alt={row.data.id} />
      </div>
    ) : (
      DEFAULT_VALUE
    );

  const columns: ColDef<Cat>[] = [
    {
      field: 'id',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Photo',
      cellRenderer: imageRenderer,
      width: 100,
    },
    {
      headerName: 'Name',
      valueGetter: () => randomCatName(),
      width: 120,
    },
    {
      headerName: 'Breed',
      valueGetter: getBreedFieldValue('name'),
      width: 150,
    },
    {
      headerName: 'First visit?',
      cellRenderer: () => (Math.random() > 0.5 ? 'Yes' : 'No'),
      width: 150,
    },
    {
      headerName: 'Vaccinated?',
      cellRenderer: () => (Math.random() > 0.5 ? 'Yes' : 'No'),
      width: 150,
    },
    // TODO: Make values selectable
    {
      headerName: 'Age',
      valueGetter: getBreedFieldValue('life_span'),
      width: 100,
    },
    // TODO: Make values selectable
    {
      headerName: 'Weight, kg',
      valueGetter: getBreedFieldValue('weight'),
      width: 120,
    },
    // TODO: Make values selectable
    {
      headerName: 'Country',
      valueGetter: getBreedFieldValue('origin'),
      width: 150,
    },
    {
      headerName: 'Description',
      valueGetter: getBreedFieldValue('description'),
      width: 300,
    },
  ];

  const tableProps: TableProps<Cat> = {
    tableName: 'cats',
    columns,
    agGridRef,
    tableDataLoader: getCatsPage,
    pageSize: 25,
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
