import type { ColumnDef } from '@tanstack/react-table';
import { Column } from '../../../interface/core/column';


export type DataTableQueryProps<T extends object> = {

    data: T[];
    columnsDef: ColumnDef<T>[];
    columns: Column[];
    loading?: boolean;
};
