export type TableQuery = {
    tableName: string;
    primaryKey: string;
    columns?: string;
    where?: string;
    orderBy?: string;
    identity?: boolean;
}