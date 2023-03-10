import { Column } from "./column";

export interface ResultQuery {
    rowCount: number;
    data: any[];
    columns: Column[]
}
