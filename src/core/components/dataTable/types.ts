import { ColumnFilter, ColumnFiltersState } from '@tanstack/react-table';
import * as Yup from 'yup';
import { Column, CustomColumn, Options, EventColumn, ObjectQuery } from '../../types';



export type DataTableQueryProps = {
    useDataTableQuery: UseDataTableQueryReturnProps;
    rows?: 10 | 25 | 50 | 100,
    height?: number;
    typeOrder?: 'asc' | 'desc';
    customColumns?: Array<CustomColumn>;
    columnVisibility?: any;
    defaultOrderBy?: string;
    numSkeletonCols?: number;
    showToolbar?: boolean;
    showRowIndex?: boolean;
    showSelectionMode?: boolean;
    showSearch?: boolean;
    showFilter?: boolean;
    title?: string;
    actionToolbar?: React.ReactNode;
};


export type UseDataTableQueryReturnProps = {
    selectionMode: 'single' | 'multiple';
    data: any[];
    columns: Column[];
    loading: boolean;
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
    // events
    onRefresh: () => void;
    onSelectRow: (id: string) => void;
    onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
    //
}

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
    showInsert: boolean;
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
    children?: React.ReactNode;
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
    showInsert?: boolean;
    title?: string;
    schema?: Yup.ObjectSchema<any | undefined, object>;
    customColumns?: Array<CustomColumn>;
    eventsColumns?: Array<EventColumn>;
};

export type UseDataTableReturnProps = {
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
    loading: boolean;
    initialize: boolean,
    primaryKey: string;
    typeOrder?: 'asc' | 'desc';
    selectionMode: 'single' | 'multiple';
    columnVisibility?: any;
    setColumnVisibility: React.Dispatch<React.SetStateAction<{}>>;
    updateIdList: number[];
    setUpdateIdList: React.Dispatch<React.SetStateAction<number[]>>;
    selected: string | string[];
    rowSelection: {};
    setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
    // events
    onRefresh: () => void;
    onSelectRow: (id: string) => void;
    onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
    // func
    insertRow: () => boolean;
    deleteRow: (indexRow?: number) => void;
    isDeleteRow: (indexRow?: number) => Promise<boolean>;
    isValidSave: () => Promise<boolean>;
    callServiceSave: () => Promise<boolean>;
    save: () => ObjectQuery[];
    clearListIdQuery: () => void;
    getInsertedRows: () => any[];
    getUpdatedRows: () => any[];
    updateData: (indexRow: number, columnName: string, value: any) => void;
    updateDataByRow: (indexRow: number, newRow: any) => void;
};

// ===================================== 