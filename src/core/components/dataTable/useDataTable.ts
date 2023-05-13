import { useEffect, useState, useCallback } from 'react';
import { UseDataTableReturnProps } from './types';
import { sendPost } from '../../services/serviceRequest';
import { ResultQuery, Column, TableQuery } from '../../types';

export type UseDataTableProps = {
    config: TableQuery;
    ref: any;
};

export default function useDataTable(props: UseDataTableProps): UseDataTableReturnProps {

    const [primaryKey, setPrimaryKey] = useState<string>("");
    const [initialize, setInitialize] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
    const [columnVisibility, setColumnVisibility] = useState({})
    const [selected, setSelected] = useState<string | string[]>(selectionMode === 'multiple' ? [] : '');

    const [rowSelection, setRowSelection] = useState({})


    useEffect(() => {
        // Create an scoped async function in the hook
        async function init() {
            await callService();
        } // Execute the created function directly
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /**
     * Actualiza la data
     */
    const onRefresh = async () => {
        setSelected(selectionMode === 'multiple' ? [] : '');
        await callService();
    };


    const onSelectionModeChange = (_selectionMode: 'single' | 'multiple') => {
        setSelectionMode(_selectionMode)
        setSelected(_selectionMode === 'multiple' ? [] : '');
    };

    //  const onUpdate2 = useCallback(async () => {
    //      console.log('2222');
    //      await callService();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
    //  }, []);

    const onSelectRow = useCallback(
        (id: string) => {
            if (selectionMode === 'single') {
                setSelected(id);
            }
            else {
                const selectedIndex = selected?.indexOf(id);
                let newSelected: string[] = [];
                if (selectedIndex === -1) {
                    newSelected = newSelected.concat(selected, id);
                } else if (selectedIndex === 0) {
                    newSelected = newSelected.concat(selected?.slice(1));
                } else if (selectedIndex === selected.length - 1) {
                    newSelected = newSelected.concat(selected?.slice(0, -1));
                } else if (selectedIndex > 0) {
                    newSelected = newSelected.concat(
                        selected.slice(0, selectedIndex),
                        selected.slice(selectedIndex + 1)
                    );
                }
                setSelected(newSelected);
            }
        },
        [selectionMode, selected]
    );


    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const callService = async () => {
        setLoading(true);
        try {
            const result = await sendPost('api/core/getResultQuery', props.config);
            const req: ResultQuery = result.data;
            if (initialize === false) {
                setInitialize(true);
                setColumns(req.columns);
                setPrimaryKey(req.primaryKey);
            }
            setData(req.rows);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }


    /**
     * Asigan el valor a una columna 
     * @param columnName 
     * @param value 
     */
    const setValue = (columnName: string, value: any) => {
        if (isColumnExist(columnName)) props.ref.current.setValue(columnName, value, { shouldValidate: true })
    }

    /**
     * Retorna el valor de una columna
     * @param columnName 
     * @returns 
     */
    const getValue = (columnName: string): any => {
        if (isColumnExist(columnName)) return props.ref.current.getValues(columnName);
        return undefined
    }

    /**
     * Valida si existe la columna
     * @param columnName 
     * @returns 
     */
    const isColumnExist = (columnName: string): boolean => {
        if (columns.find((col) => col.name === columnName)) return true;
        throw new Error(`ERROR. la Columna ${columnName} no existe`);
    }

    /**
     * Retorna un objeto columna
     * @param columnName 
     * @returns 
     */
    const getColumn = (columnName: string): Column => {
        const col = columns.find((_col) => _col.name === columnName);
        if (col === undefined) throw new Error(`ERROR. la Columna ${columnName} no existe`)
        return col;
    }

    const getVisibleColumns = (): Column[] => columns.filter((_col: Column) => _col.visible === true)

    return {
        data,
        columns,
        setColumns,
        getVisibleColumns,
        initialize,
        primaryKey,
        loading,
        selected,
        columnVisibility,
        setColumnVisibility,
        selectionMode,
        rowSelection,
        setRowSelection,
        onRefresh,
        onSelectRow,
        onSelectAllRows,
        onSelectionModeChange
    }
}
