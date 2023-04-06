
export type DropdownProps = {
    options: any[];
    value: any;
    selectionMode: 'single' | 'multiple';
    loading: boolean;
    // events
    onChange?: () => void;
};