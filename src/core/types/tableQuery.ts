export type TableQuery = {
    module: string;
    tableName: string;
    primaryKey: string;
    columns?: string;
    where?: string;
    orderBy?: string;
    generatePrimaryKey?: boolean;
}
