import * as Yup from 'yup';

import { ResponseSWR } from '../../types/query';
import { Column,  EventColumn,CustomColumn } from '../../types';

export type UseFormTableProps = {
    config: ResponseSWR; // TableQuery
    ref: any;
};

export type UseFormTableReturnProps = {
    currentValues: object,
    columns: Column[],
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
    primaryKey: string,
    isUpdate: boolean,
    isLoading: boolean,
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
    schema?: Yup.ObjectSchema<any | Yup.AnyObject, object>  ;
    customColumns?: Array<CustomColumn>;
    eventsColumns?: Array<EventColumn>;
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
