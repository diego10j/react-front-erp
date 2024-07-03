import type { ZodObject, ZodRawShape } from 'zod';

import type { ObjectQuery } from '../../types/objectQuery';
import type { Column, EventColumn, ResponseSWR, CustomColumn } from '../../types';


export type UseFormTableProps = {
  config: ResponseSWR; // TableQuery
  ref: any;
  generatePrimaryKey?: boolean;
};

export type UseFormTableReturnProps = {
  ref: any,
  currentValues: any,
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  primaryKey: string,
  isUpdate: boolean,
  isLoading: boolean,
  initialize: boolean,
  setValue: (columName: string, value: any) => void,
  getValue: (columName: string) => any,
  getColumn: (columName: string) => Column,
  updateChangeColumn: (columName: string, newValue?: any) => void,
  getVisibleColumns: () => Column[],
  isValidSave: (dataForm: any) => Promise<boolean>;
  isPendingChanges: () => boolean;
  setColsUpdate: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentValues: React.Dispatch<React.SetStateAction<any>>,
  saveForm: (dataForm: any) => ObjectQuery[];
  // events
  onRefresh: () => void;
  // onSave: (data: object) => void;
};

export type FormTableProps = {
  useFormTable: UseFormTableReturnProps;
  showToolbar?: boolean;
  showSubmit?: boolean;
  numSkeletonCols?: number;
  schema?: ZodObject<ZodRawShape>;
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
