import { Column } from './column';
import { Options } from './options';
import { ListDataConfig } from './listDataConfig';
import { LabelColor, LabelVariant } from '../../components/label/types';

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
  upperCase?: boolean;
  comment?: string;
  size?: number;
  dropDown?: ListDataConfig;
  radioGroup?: Options[];
  labelComponent?: { color: LabelColor; variant?: LabelVariant; startIcon?: React.ReactElement | null; endIcon?: React.ReactElement | null; }
  renderComponent?: (value: any, row?: any, column?: Column ) => React.ReactElement;
  component?: 'Image' | 'Avatar' | 'Checkbox';
};
