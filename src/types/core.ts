export type IFindByUuid = {
  tableName: string,
  uuid: string,
  columns?: string
};

export type ISave =
  {
    listQuery: [{
      tableName: string,
      primaryKey: string,
      object: any,
      operation: 'update' | 'insert'
    }]
  };
