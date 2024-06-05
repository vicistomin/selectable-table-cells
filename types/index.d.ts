import Constants from '@/const';
import { ColDef, RowValueChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject } from 'react';

export type Handler<T> = (t: T) => unknown;
export type EmptyHandler = () => unknown;

export type Entity = {
  id: ID;
};

export type Order = (typeof Constants.Order.OPTIONS)[number];

export type PageQueryParams = {
  /**
   * Page number
   */
  page: number;
  /**
   * Page size
   */
  limit: number;
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

export type Breed = Entity & {
  name: string;
  description: string;
  alt_names: string;
  temperament: string;
  origin: string;
  // Ranges as string
  life_span: string;
  country_code: string;
  country_codes: string;
  reference_image_id: string;
  // Weight ranges as strings
  weight: { imperial: string; metric: string };
  // Links
  vcahospitals_url: string;
  vetstreet_url: string;
  wikipedia_url: string;
  cfa_url: string;
  // Numerical data
  adaptability: number;
  affection_level: 5;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  experimental: number;
  grooming: number;
  hairless: number;
  health_issues: number;
  hypoallergenic: number;
  indoor: number;
  intelligence: number;
  natural: number;
  rare: number;
  rex: number;
  shedding_level: number;
  short_legs: number;
  social_needs: number;
  stranger_friendly: number;
  suppressed_tail: number;
  vocalisation: number;
};

export type Cat = Entity & {
  breeds: Breed[];
  // Image metadata
  url: string;
  width: number;
  height: number;
};
