import { Column } from "./column";

export type ResultQuery = {
    rowCount: number;
    rows: any[];
    columns: Column[];
    primaryKey: string;
    totalSizeTable: number;

}
