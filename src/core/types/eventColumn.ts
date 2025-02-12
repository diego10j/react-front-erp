export type EventColumn = {
    name: string;
    // events    
    onChange?: () => void;
    onClick?: (row: any) => void;
};

