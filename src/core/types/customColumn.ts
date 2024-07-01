import type { Column } from './column';
import type { Options } from './options';
import type { ListDataConfig } from './listDataConfig';
import type { LabelColor, LabelVariant } from '../../components/label/types';

export type CustomColumn = {
  name: string;
  label?: string;
  defaultValue?: any;
  visible?: boolean;
  filter?: boolean;
  disabled?: boolean;
  required?: boolean;
  unique?: boolean;
  orderable?: boolean;
  order?: number;
  align?: 'left' | 'center' | 'right';
  decimals?: number;
  sum?: boolean;
  upperCase?: boolean;
  comment?: string;
  size?: number;
  dropDown?: ListDataConfig;
  radioGroup?: {
    label: string;
    value: string;
  }[];
  labelComponent?: { color: LabelColor; variant?: LabelVariant; startIcon?: React.ReactElement | null; endIcon?: React.ReactElement | null; }
  renderComponent?: (value: any, row?: any, column?: Column) => React.ReactElement;
  component?: 'Image' | 'Avatar' | 'Checkbox' | 'Money';
};
