import { ColumnFiltersState } from '@tanstack/react-table';
import { Column } from '../../types';

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

export type CustomColumn = {
    name: string;
    label?: string;
    defaultValue?: any;
    visible?: boolean;
    filter?: boolean;
    disabled?: boolean;
    orderable?: boolean;
    order?: number;
    align?: 'left' | 'center' | 'right';
    decimals?: number;
    upperCase?: boolean;
    comment?: string;
    size?: number;
};

