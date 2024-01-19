import { ObjectQuery } from "src/core/types";

export type IFindByUuid = {
  tableName: string,
  uuid: string,
  columns?: string
};

export type ISave =
  {
    listQuery: ObjectQuery[]
  };
