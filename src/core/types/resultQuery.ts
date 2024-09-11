import type { Column } from "./column";

export type ResultQuery = {
  rowCount?: number;
  rows?: any[];
  charts?: any[];
  columns?: Column[];
  key?: string;
  ref?: string;
  row?: object;
  error?: boolean;
}
