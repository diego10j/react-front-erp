import type { Column } from "./column";

export type ResultQuery = {
  rowCount?: number;
  rows?: any[];
  columns?: Column[];
  key?: string;
  ref?: string;
  row?: object;
  error?: boolean;
}
