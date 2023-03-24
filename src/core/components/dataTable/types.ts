import { Column } from '../../interface/column';

export type DataTableQueryProps = {
    data: any[];
    columns: Column[];
    loading: boolean;
    rows?: 10 | 25 | 50 | 100,
    typeOrder?: 'asc' | 'desc';
    columnVisibility?: any;
    defaultOrderBy?: string;
    numSkeletonCols?: number;
    showToolbar?: boolean;
    // events
    onRefresh?: () => void;
};

export type DataTableSkeletonProps = {
    rows: 10 | 25 | 50 | 100,
    numColumns?: number,
}

export type DataTableToolbarProps = {
    type: "DataTableQuery" | "DataTable",
    onRefresh?: () => void;
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
};

