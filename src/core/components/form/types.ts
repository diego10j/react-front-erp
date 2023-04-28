import * as Yup from 'yup';
import { TableQuery, Column, CustomColumn } from '../../types';

export type UseFormTableProps = {
    config: TableQuery;
    ref: any;
};

export type UseFormTableReturnProps = {
    currentValues: object,
    columns: Column[],
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
    primaryKey: string,
    isUpdate: boolean,
    loading: boolean,
    initialize: boolean,
    setValue: (columName: string, value: any) => void,
    getValue: (columName: string) => any,
    getColumn: (columName: string) => Column,
    getVisibleColumns: ()=> Column[],
    // events
    onRefresh: () => void;
    onSave: (data: object) => void;
};

export type FormTableProps = {
    useFormTable: UseFormTableReturnProps;
    showToolbar?: boolean;
    showSubmit?: boolean;
    numSkeletonCols?: number;
    schema?: Yup.ObjectSchema<any | undefined, object>
    customColumns?: Array<CustomColumn>;
};

export type FormTableToolbarProps = {
    title?: string;
    onRefresh: () => void;
    onExportExcel: () => void;
}

export type FormTableSkeletonProps = {
    showSubmit: boolean;
    showToolbar: boolean;
    numColumns?: number;

}
