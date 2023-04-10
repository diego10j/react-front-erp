
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