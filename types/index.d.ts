import Constants from '@/const';
import { ColDef, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject } from 'react';

export type Handler<T> = (t: T) => unknown;
export type EmptyHandler = () => unknown;

export type Entity = {
  id: ID;
};

export type PageSize = (typeof Constants.PageSize.OPTIONS)[number];
export type Order = (typeof Constants.Order.OPTIONS)[number];

export type PageQueryParams = {
  /**
   * Page number
   */
  page: number;
  /**
   * Page size
   */
  limit: PageSize;
  /**
   * Sort by creation date
   */
  order: Order;
};

// Method required for AG Grid for managing requests to server for the table data
// Generic property T: table elements type
export type TableLoader<T extends Entity> = (
  pageQuery: PageQueryParams
) => Promise<T[]>;

export type TableColumn<T extends Entity> = {
  type?: AutoFormatType | Array<string>;
  renderer?: CellRenderer<T>;
  defaultValue?: string;
  format?: string;
} & ColDef<T>;

export interface TableProps<T extends Entity> {
  columns: TableColumn<T>[];
  tableName: string;
  // Required method to connect the AG Grid with certain server API endpoint to load table data
  tableDataLoader: TableLoader<T>;
  // Required ref for getting access to the AG Grid API methods
  agGridRef: RefObject<AgGridReact<T>>;

  // optional properties
  defaultOrder?: Order;
  // Initial page size value that is passed to AG Grid
  pageSize?: number;

  // Optional handler for performing custom additional actions after the row value was changed during in-line editing
  onRowValueChanged?: Handler<RowValueChangedEvent<T>>;
}
