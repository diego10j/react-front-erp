import { ListDataValues, Query } from '../../types';


export type DropdownProps = {
    options: any[];
    value: string | null;
    selectionMode: 'single' | 'multiple';
    label?: string;
    loading: boolean;
    setValue: React.Dispatch<React.SetStateAction<string | null>>;
    // events
    onChange?: () => void;
};

export type UseDropdownProps = {
    config: ListDataValues | Query;
    selectionMode?: 'single' | 'multiple';
};