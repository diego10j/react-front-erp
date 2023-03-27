export interface Column {
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
    default: any;
    mask: string;
    filter: boolean | undefined;
    comment: string | undefined;
    upperCase: boolean | undefined;
    unique: boolean;
    orderable: boolean | undefined;
    size?: number;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    header: string | undefined;
    accessorKey: string;
}
