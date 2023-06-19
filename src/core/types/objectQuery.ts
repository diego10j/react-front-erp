export type ObjectQuery = {
    operation: 'insert' | 'update' | 'delete' ;
    tableName: string;
    primaryKey: string;
    object: object;
}
