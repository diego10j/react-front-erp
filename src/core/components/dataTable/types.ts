import type { MutableRefObject } from 'react';
import type { ZodObject, ZodRawShape } from 'zod';
import type { ColumnFilter, ColumnFiltersState } from '@tanstack/react-table';

import type { Column, Options, EventColumn, ObjectQuery, CustomColumn } from '../../types';



export type DataTableQueryProps = {
  useDataTableQuery: UseDataTableQueryReturnProps;
  rows?: 10 | 25 | 50 | 100,
  restHeight?: number;
  staticHeight?: number;
  typeOrder?: 'asc' | 'desc';
  customColumns?: Array<CustomColumn>;
  columnVisibility?: any;
  defaultOrderBy?: string;
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
};


export type UseDataTableQueryReturnProps = {
  daTabRef: MutableRefObject<any>;
  selectionMode: 'single' | 'multiple';
  data: any[];
  columns: Column[];
  isLoading: boolean;
  initialize: boolean,
  primaryKey: string;
  selected: string | string[];
  index: number;
  rowSelection: {};
  columnVisibility?: any;
  setColumnVisibility: React.Dispatch<React.SetStateAction<{}>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setColumnFilters: (filters: ColumnFilter[]) => void;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  // gets
  getSumColumn: (columName: string) => number;
  // events
  onRefresh: () => void;
  onSelectRow: (id: string) => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
  //
}

export type DataTableSkeletonProps = {
  rows: 10 | 25 | 50 | 100;
  numColumns?: number;
  heightRow?: number;
}

export type DataTableToolbarProps = {
  type: "DataTableQuery" | "DataTable";
  selectionMode: 'single' | 'multiple';
  globalFilter: string;
  setGlobalFilter: any;
  showSelectionMode: boolean;
  showSearch: boolean;
  showFilter: boolean;
  showRowIndex: boolean;
  showInsert: boolean;
  showDelete: boolean;
  showOptions: boolean;
  rowSelection: {};
  openFilters: boolean;
  initialize: boolean,
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayIndex: React.Dispatch<React.SetStateAction<boolean>>;
  setReadOnly?: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: () => void;
  onExportExcel: () => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
  onInsert?: () => void;
  onDelete?: () => void;
  onOpenConfig: () => void;
  children?: React.ReactNode;
}



// =====================================  DataTable
export type DataTableProps = {
  useDataTable: UseDataTableReturnProps;
  editable: boolean;
  rows?: 10 | 25 | 50 | 100,
  typeOrder?: 'asc' | 'desc';
  columnVisibility?: any;
  defaultOrderBy?: string;
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
  isPendingChanges: () => boolean;
  callSaveService: () => Promise<boolean>;
  saveDataTable: () => ObjectQuery[];
  clearListIdQuery: () => void;
  commitChanges: () => void;
  getInsertedRows: () => any[];
  getUpdatedRows: () => any[];
  updateData: (indexRow: number, columnName: string, value: any) => void;
  updateDataByRow: (indexRow: number, newRow: any) => void;
};

// =====================================
