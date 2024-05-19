import { Options, ResponseSWR } from '../../types';

export type DropdownProps = {
  useDropdown: UseDropdownReturnProps;
  label?: string;
  disabled?: boolean;
  showEmptyOption?: boolean;
  helperText?: string;
  // events
  onChange?: () => void;
};

export type UseDropdownProps = {
  config: ResponseSWR;   // Query , ListDataValues
  defaultValue?: string | null;
  selectionMode?: 'single' | 'multiple';
};

export type UseDropdownReturnProps = {
  options: any[];
  value: string | null;
  selectionMode: 'single' | 'multiple';
  isLoading: boolean;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  getOptionLabel: (option: Options) => string;
  initialize: boolean;
};


