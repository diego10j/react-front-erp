import { ListDataValues, Query, Options } from '../../types';

export type DropdownProps = {
    useDropdown: UseDropdownReturnProps;
    label?: string;
    // events
    onChange?: () => void;
};

export type UseDropdownProps = {
    config: ListDataValues | Query;
    selectionMode?: 'single' | 'multiple';
};


export type UseDropdownReturnProps = {
    options: any[];
    value: string | null;
    selectionMode: 'single' | 'multiple';
    loading: boolean;
    setValue: React.Dispatch<React.SetStateAction<string | null>>;
    getOptionLabel: (option: Options) => string;
};


