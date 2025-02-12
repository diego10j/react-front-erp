import type { Options, ResponseSWR } from '../../types';

export type DropdownProps = {
  useDropdown: UseDropdownReturnProps;
  label?: string;
  disabled?: boolean;
  showEmptyOption?: boolean;
  helperText?: string;
  emptyLabel?: string;
  // events
  onChange?: (optionId: string) => void;
};

export type UseDropdownProps = {
  config: ResponseSWR;   // Query , ListDataValues
  defaultValue?: string | null;
};

export type UseDropdownReturnProps = {
  options: any[];
  value: string | null;
  isLoading: boolean;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  getOptionLabel: (option: Options) => string;
  onRefresh: () => void;
  initialize: boolean;
};




export type DropdownMultipleProps = {
  useDropdownMultiple: UseDropdownMultipleReturnProps;
  id: string;
  label: string;
  disabled?: boolean;
  showEmptyOption?: boolean;
  helperText?: string;
  emptyLabel?: string;
  placeholder?: string;
  chip?: boolean;
  // events
  onChange?: (optionesId: string[]) => void;
};

export type UseDropdownMultipleProps = {
  config: ResponseSWR;   // Query , ListDataValues
  defaultValue?: string[] | undefined;
};

export type UseDropdownMultipleReturnProps = {
  options: any[];
  value: string[] | undefined;
  isLoading: boolean;
  setValue: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  getOptionLabel: (option: Options) => string;
  onRefresh: () => void;
  initialize: boolean;
};






