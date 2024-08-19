import type { ObjectQuery } from "src/core/types";

export type IFindByUuid = {
  tableName: string,
  uuid: string,
  columns?: string
};

export type ISave =
  {
    listQuery: ObjectQuery[],
    audit?: boolean;
  };


export type ITreeModel =
  {
    tableName: string,
    primaryKey: string,
    columnName: string,
    columnNode: string,
    orderBy?: string,
    condition?: string
  };
