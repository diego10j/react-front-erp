import type { MutableRefObject } from 'react';
import type { ZodObject, ZodRawShape } from 'zod';

import type { UseDropdownReturnProps } from '../dropdown';
import type { ObjectQuery } from '../../types/objectQuery';
import type { Column, EventColumn, ResponseSWR, CustomColumn } from '../../types';



export type UseFormTableProps = {
  config: ResponseSWR; // TableQuery
  generatePrimaryKey?: boolean;
};

export type UseFormTableReturnProps = {
  formRef: MutableRefObject<any>;
  currentValues: any,
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  primaryKey: string,
  isUpdate: boolean,
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>,
  isSuccessSubmit: boolean,
  setIsSuccessSubmit: React.Dispatch<React.SetStateAction<boolean>>,
  isLoading: boolean,
  initialize: boolean,
  setValue: (columName: string, value: any) => void,
  getValue: (columName: string) => any,
  getColumn: (columName: string) => Column,
  updateChangeColumn: (columName: string, newValue?: any) => void,
  updateDropdown: (columnName: string, dropDown: UseDropdownReturnProps) => void,
  getVisibleColumns: () => Column[],
  isValidSave: (dataForm: any) => Promise<boolean>;
  isPendingChanges: () => boolean;
  setColsUpdate: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentValues: React.Dispatch<React.SetStateAction<any>>,

  saveForm: (dataForm: any) => ObjectQuery[];
  // events
  onRefresh: () => void;
  mutate: () => void;
  // onSave: (data: object) => void;
};

export type FormTableProps = {
  ref: MutableRefObject<any>;
  useFormTable: UseFormTableReturnProps;
  showToolbar?: boolean;
  showSubmit?: boolean;
  numSkeletonCols?: number;
  hrefPath?: string;
  schema?: ZodObject<ZodRawShape>;
  customColumns?: Array<CustomColumn>;
  eventsColumns?: Array<EventColumn>;
  children?: React.ReactNode;
  // events
  onSubmit?: (data: any) => void;
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
