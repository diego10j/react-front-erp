export interface Column {
    name: string;
    tableID: string;
    dataTypeID: number;
    dataType: string;
    label: string;
    required: boolean;
    order: number;
    length: number;
    decimals: number;
    disabled: boolean;
    default: any;
    mask: string;
    filter: boolean;
    comment: string;
    upperCase: boolean;
    unique: boolean;
    orderable: boolean;
    size: number;
}
