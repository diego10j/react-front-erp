import type { MutableRefObject } from 'react';
import type { ZodObject, ZodRawShape } from 'zod';
import type { PaginationTable } from 'src/core/types/pagination';
import type { UsePopoverReturn } from 'src/components/custom-popover';
import type { SortingState, PaginationState, ColumnFiltersState } from '@tanstack/react-table';

import type { Column, Options, EventColumn, ObjectQuery, CustomColumn } from '../../types';


export type DataTableQueryProps = {
  useDataTableQuery: UseDataTableQueryReturnProps;
  rows?: 10 | 25 | 50 | 100,
  restHeight?: number;
  staticHeight?: number;
  customColumns?: Array<CustomColumn>;
  columnVisibility?: any;
  numSkeletonCols?: number;
  heightSkeletonRow?: number;
  showToolbar?: boolean;
  showRowIndex?: boolean;
  showPagination?: boolean;
  showSelectionMode?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showDelete?: boolean;
  showOptions?: boolean;
  title?: string;
  actionToolbar?: React.ReactNode;
  eventsColumns?: Array<EventColumn>;
  orderable?: boolean;
  onDelete?: () => void;
};


export type UseDataTableQueryReturnProps = {
  daTabRef: MutableRefObject<any>;
  selectionMode: 'single' | 'multiple';
  data: any[];
  columns: Column[];
  isLoading: boolean;
  initialize: boolean,
  processing: boolean,  // para procesamientos como delete, refresh
  primaryKey: string;
  selected: string | string[];
  index: number;
  rowSelection: {};
  columnVisibility?: any;
  columnFilters: ColumnFiltersState;
  sorting: SortingState,
  paginationResponse?:PaginationTable,
  totalRecords: number,
  pagination:PaginationState,
  setColumnVisibility: React.Dispatch<React.SetStateAction<{}>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  // gets
  getSumColumn: (columName: string) => number;
  // events
  onRefresh: () => void;
  onSelectRow: (id: string) => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
  onDeleteRows: (tableName: string, pk: string) => void;
  onSort: (columName: string) => void;
  onPaginationChange: (newPagination: PaginationState) => void;
  //
}

export type DataTableSkeletonProps = {
  rows: 10 | 25 | 50 | 100;
  numColumns?: number;
  heightRow?: number;
}

export type DataTableToolbarProps = {
  type: "DataTableQuery" | "DataTable";
  globalFilter: string;
  setGlobalFilter: any;
  showSearch: boolean;
  showFilter: boolean;
  showInsert: boolean;
  showDelete: boolean;
  showOptions: boolean;
  rowSelection: {};
  openFilters: boolean;
  initialize: boolean,
  popover: UsePopoverReturn;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
  onInsert?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}



// =====================================  DataTable
export type DataTableProps = {
  useDataTable: UseDataTableReturnProps;
  editable?: boolean;
  rows?: 10 | 25 | 50 | 100,
  columnVisibility?: any;
  numSkeletonCols?: number;
  showToolbar?: boolean;
  showRowIndex?: boolean;
  showSelectionMode?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showInsert?: boolean;
  showDelete?: boolean;
  showOptions?: boolean;
  showPagination?: boolean;
  title?: string;
  restHeight?: number;
  staticHeight?: number;
  schema?: ZodObject<ZodRawShape>;
  customColumns?: Array<CustomColumn>;
  eventsColumns?: Array<EventColumn>;
  orderable?: boolean;
  // eventos
  onDeleteSuccess?: () => void;
};

export type UseDataTableReturnProps = {
  daTabRef: MutableRefObject<any>;
  data: any[];
  columns: Column[];
  optionsColumn: Map<string, Options[]>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  index: number;
  generatePrimaryKey: boolean;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  getValue: (index: number, columnName: string) => any,
  setValue: (index: number, columnName: string, value: any) => void;
  isLoading: boolean;
  initialize: boolean,
  primaryKey: string;
  typeOrder?: 'asc' | 'desc';
  selectionMode: 'single' | 'multiple';
  columnVisibility?: any;
  sorting: SortingState,
  pagination?:PaginationTable,
  totalRecords: number,
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<{}>>;
  updateIdList: number[];
  setUpdateIdList: React.Dispatch<React.SetStateAction<number[]>>;
  rowSelection: {};
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  errorCells: { rowIndex: number, columnId: string }[];
  setErrorCells: React.Dispatch<React.SetStateAction<{ rowIndex: number, columnId: string }[]>>;
  // events
  onRefresh: () => void;
  onReset: () => void;
  onSelectRow: (id: string) => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;

  removeErrorCells: (rowIndex: number, columnId: string) => void;
  addErrorCells: (rowIndex: number, columnId: string) => void;
  // func
  insertRow: () => boolean;
  deleteRow: (indexRow?: number) => void;
  canDeleteRow: (indexRow?: number) => Promise<boolean>;
  isValidSave: () => Promise<boolean>;
  isChangeDetected: () => boolean;
  callSaveService: () => Promise<boolean>;
  saveDataTable: () => ObjectQuery[];
  clearListIdQuery: () => void;
  commitChanges: () => void;
  getInsertedRows: () => any[];
  getUpdatedRows: () => any[];
  updateData: (indexRow: number, columnName: string, value: any) => void;
  updateDataByRow: (indexRow: number, newRow: any) => void;
  onSort: (columName: string) => void;
};

// =====================================


export type SortDirectionCol = 'ASC' | 'DESC';

export type OrderBy = {
  column: string;
  direction: SortDirectionCol;
};

