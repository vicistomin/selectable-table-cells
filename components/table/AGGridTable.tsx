'use client';

import Constants from '@/const';
import { Entity, Order, TableProps } from '@/types';
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModelItem,
} from 'ag-grid-community';
import 'ag-grid-enterprise'; // enterprise is needed for the server store
import { AgGridReact } from 'ag-grid-react';
import { ReactNode, useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme CSS

// Default column width in px
export const DEFAULT_WIDTH = 200;

/**
 * Component for rendering the dynamic tables
 *
 * Supports lazy infinite rows loading and server-side sorting
 */
const AGGridTable = <T extends Entity>(props: TableProps<T>): ReactNode => {
  const {
    tableDataLoader,
    columns,
    agGridRef,
    pageSize = Constants.PageSize.DEFAULT,
    defaultOrder = Constants.Order.DEFAULT,
    onRowValueChanged,
  } = props;
  // Method that returns the getRows callback for the AG Grid ServerSide Store
  // Here is performed the table data requests on server with applied Sorting model
  const getRows = (params: IServerSideGetRowsParams): void => {
    console.log('New table data request with params', params);

    agGridRef.current?.api.hideOverlay();

    // Using data from AG Grid request to calculate current page size
    const newPageSize = params.request.endRow
      ? params.request.endRow - (params.request?.startRow || 0)
      : pageSize;

    // define the new Page request params
    const newPage: number = Math.floor(
      (params.request.startRow || 0) / newPageSize
    );

    // Sending only first column sort mode for the request with multi-level sorting
    const newSortingParams: Array<SortModelItem> = params.request.sortModel;
    const newSort =
      newSortingParams.length > 0
        ? (newSortingParams[0].sort.toUpperCase() as Order)
        : defaultOrder;

    // Show "ERR" message instead of table data
    const handleError = (err: Error) => {
      console.error('Get AG Grid rows data error', err);
      // Display error notification only if Table is mounted (e.g. server errors)
      agGridRef.current;
      // inform that grid request failed
      setTimeout(() => agGridRef.current && params && params.fail(), 0);
    };

    // Do request action: get data for request from server
    tableDataLoader({ page: newPage, limit: newPageSize, order: newSort })
      .then((response) => {
        console.log({ response });
        // Checking if there is any `null` Row element in the Page from server
        const hasServerError =
          !Array.isArray(response) || response.some((row) => !row);

        hasServerError
          ? // Force Table to "Error" state if there is any nullable Row elements in server response
            handleError({
              message:
                'There is an error in server data. Please report to tech support to fix it',
            } as Error)
          : // Supply rows for requested block to grid
            agGridRef.current &&
            params &&
            params.success({
              rowData: response,
            });
      })
      .catch(handleError);
  };

  const serverSideDatasource = useMemo<IServerSideDatasource>(
    () => ({
      // called by the grid when more rows are required
      getRows,
    }),
    [columns]
  );

  return (
    <div className="ag-theme-quartz-auto-dark w-full h-full">
      <AgGridReact<T>
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        getRowId={(row) => row.data.id}
        maxConcurrentDatasourceRequests={1}
        blockLoadDebounceMillis={300}
        ref={agGridRef} // Ref for accessing Grid's API
        columnDefs={columns}
        animateRows
        rowSelection="multiple"
        headerHeight={42}
        floatingFiltersHeight={40}
        suppressMultiSort
        suppressCopyRowsToClipboard
        editType="fullRow"
        stopEditingWhenCellsLoseFocus
        onRowValueChanged={(params) => {
          onRowValueChanged && onRowValueChanged(params);
        }}
      />
    </div>
  );
};

export default AGGridTable;
