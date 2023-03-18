import { Column } from '../../interface/column';

export type DataTableQueryProps = {

    data: any[];
    columns: Column[];
    loading: boolean;
    columnVisibility: any
};


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