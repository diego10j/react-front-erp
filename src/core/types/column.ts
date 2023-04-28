import { ListDataValues } from './listDataValues';
import { Options } from './options';

export type Column = {
    name: string;
    tableID: string;
    dataTypeID: number;
    dataType: string;
    label: string | undefined;
    required: boolean | undefined;
    visible: boolean | undefined;
    order: number | undefined;
    length: number;
    decimals: number | undefined;
    disabled: boolean | undefined;
    defaultValue: any;
    component?: 'Text' | 'Calendar' | 'Checkbox' | 'TextArea' | 'Dropdown' | 'Image' | 'Upload' | 'RadioGroup';
    mask: string;
    comment: string | undefined;
    upperCase: boolean | undefined;
    unique: boolean;
    size?: number;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    header: string | undefined;
    accessorKey: string;
    enableColumnFilter?: boolean;
    enableSorting?: boolean;
    dropDown?: ListDataValues;
    radioGroup?: Options[];
    // Events
    onChange?: () => void;
}
