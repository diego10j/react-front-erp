import type { ObjectQuery } from "src/core/types";



export type ITableQuery = {
  module: string,
  tableName: string,
  primaryKey: string,
  columns?: string
  condition?: string
};

export type IFindByUuid = {
  module: string,
  tableName: string,
  primaryKey: string,
  uuid?: string,
  columns?: string
};

export type IFindById = {
  module: string,
  tableName: string,
  primaryKey: string,
  value: number,
  columns?: string
};

export type ISave =
  {
    listQuery: ObjectQuery[],
    audit?: boolean;
  };


export type ITreeModel =
  {
    module: string,
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
