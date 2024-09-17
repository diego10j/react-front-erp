import type { ObjectQuery } from "src/core/types";



export type ITableQuery= {
  tableName: string,
  primaryKey: string,
  columns?: string
  where?: string
};

export type IFindByUuid = {
  tableName: string,
  primaryKey: string,
  uuid?: string,
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


export type IUuid = {
  uuid: string
};
