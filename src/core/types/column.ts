import { Options } from './options';
import { ListDataConfig } from './listDataConfig';

export type Column = {
  name: string;
  tableID: string;
  dataTypeID: number;
  dataType: string;
  label: string | undefined;
  required: boolean | undefined;
  visible: boolean | undefined;
  unique: boolean | undefined;
  order: number | undefined;
  length: number;
  decimals: number | undefined;
  disabled: boolean | undefined;
  defaultValue: any;
  component?: 'Text' | 'Calendar' | 'Checkbox' | 'TextArea' | 'Dropdown' | 'Image' | 'Upload' | 'RadioGroup' | 'Time' | 'CalendarTime';
  mask: string;
  comment: string | undefined;
  upperCase: boolean | undefined;
  size?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  header: string | undefined;
  accessorKey: string;
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  dropDown?: ListDataConfig;
  isLoading?: boolean;
  radioGroup?: Options[];
  // Events
  onChange?: () => void;
}
