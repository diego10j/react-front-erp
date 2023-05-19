import { ColumnFiltersState } from '@tanstack/react-table';
import * as Yup from 'yup';
import { Column, CustomColumn } from '../../types';


export type DataTableQueryProps = {
    data: any[];
    columns: Column[];
    loading: boolean;
    primaryKey: string;
    rows?: 10 | 25 | 50 | 100,
    height?: number;
    typeOrder?: 'asc' | 'desc';
    selectionMode: 'single' | 'multiple';
    columnVisibility?: any;
    defaultOrderBy?: string;
    numSkeletonCols?: number;
    showToolbar?: boolean;
    showRowIndex?: boolean;
    showSelectionMode?: boolean;
    showSearch?: boolean;
    showFilter?: boolean;
    title?: string;
    selected: string | string[];
    // events
    onRefresh: () => void;
    onSelectRow: (id: string) => void;
    onSelectAllRows: (checked: boolean, newSelecteds: string[]) => void;
    onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
    //
};

export type DataTableSkeletonProps = {
    rows: 10 | 25 | 50 | 100;
    numColumns?: number;
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
    openFilters: boolean;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
    setDisplayIndex: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
    onExportExcel: () => void;
    onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
}



// =====================================  DataTable
export type DataTableProps = {
    useDataTable: UseDataTableReturnProps;
    editable: boolean;
    rows?: 10 | 25 | 50 | 100,
    height?: number;
    typeOrder?: 'asc' | 'desc';
    columnVisibility?: any;
    defaultOrderBy?: string;
    numSkeletonCols?: number;
    showToolbar?: boolean;
    showRowIndex?: boolean;
    showSelectionMode?: boolean;
    showSearch?: boolean;
    showFilter?: boolean;
    title?: string;
    schema?: Yup.ObjectSchema<any | undefined, object>
    customColumns?: Array<CustomColumn>;
};

export type UseDataTableReturnProps = {
    data: any[];
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    getVisibleColumns: () => Column[];
    loading: boolean;
    initialize: boolean,
    primaryKey: string;
    typeOrder?: 'asc' | 'desc';
    selectionMode: 'single' | 'multiple';
    columnVisibility?: any;
    setColumnVisibility: React.Dispatch<React.SetStateAction<{}>>;
    selected: string | string[];
    rowSelection: {};
    setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
    // events
    onRefresh: () => void;
    onSelectRow: (id: string) => void;
    onSelectAllRows: (checked: boolean, newSelecteds: string[]) => void;
    onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
};

// ===================================== 