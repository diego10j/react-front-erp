import { ListDataValues } from './listDataValues';
import { Options } from './options';

export type CustomColumn = {
    name: string;
    label?: string;
    defaultValue?: any;
    visible?: boolean;
    filter?: boolean;
    disabled?: boolean;
    required?: boolean;
    orderable?: boolean;
    order?: number;
    align?: 'left' | 'center' | 'right';
    decimals?: number;
    upperCase?: boolean;
    comment?: string;
    size?: number;
    dropDown?: ListDataValues;
    radioGroup?: Options[];
};

