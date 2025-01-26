export type ObjectQuery = {
    operation: 'insert' | 'update' | 'delete' ;
    module: string;
    tableName: string;
    primaryKey: string;
    object: object;
}
