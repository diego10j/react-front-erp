import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableQueryProps } from "./types";
import { sendPost } from '../../../services/serviceRequest';
import { ResultQuery } from '../../../interface/core/resultQuery';
import { Column } from '../../../interface/core/column';
import { toTitleCase } from '../../../utils/stringUtil';


export default function useDataTableQuery<T extends object>(serviceName: string, params: any): DataTableQueryProps<T> {

    const [data, setData] = useState<T[]>([]);
    const [columnsDef, setColumnsDef] = useState<ColumnDef<T>[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const result = await sendPost(serviceName, params);
            const req: ResultQuery = result.data;
            setData(req.data);
            setColumns(req.columns);
            setColumnsDef(req.columns.map(col => ({
                ...col,
                header: toTitleCase(col.label),
                accessorKey: col.name,
            })))
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        data,
        columns,
        loading,
        columnsDef
    }
}
