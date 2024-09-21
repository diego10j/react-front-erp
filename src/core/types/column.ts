import type { UseDropdownReturnProps } from '../components/dropdown';
import type { LabelColor, LabelVariant } from '../../components/label/types';

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
  component?: 'Text' | 'Calendar' | 'Checkbox' | 'TextArea' | 'Dropdown' | 'Image' | 'Upload' | 'RadioGroup' | 'Time' | 'CalendarTime' | 'Label' | 'Render' | 'Active' | 'Percent';
  mask: string;
  comment: string | undefined;
  upperCase: boolean | undefined;
  size?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  header: string | undefined;
  accessorKey: string;
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  formControlled?: boolean;
  dropDown?: UseDropdownReturnProps;
  isLoading?: boolean;
  radioGroup?: {
    label: string;
    value: string;
  }[];
  sum?: boolean;
  labelComponent?: { color: LabelColor; variant?: LabelVariant; startIcon?: React.ReactElement | null; endIcon?: React.ReactElement | null; }
  renderComponent?: (value: any, row?: any, column?: Column) => React.ReactElement;
  // Events
  onChange?: () => void;
}
