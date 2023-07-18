import { useEffect, useState, useCallback } from 'react';
import { UseDataTableQueryReturnProps } from './types';
import { sendPost } from '../../services/serviceRequest';
import { ResultQuery, Column, Query, CustomColumn, TableQuery } from '../../types';

export type UseDataTableQueryProps = {
    query: Query | TableQuery;
    customColumns?: Array<CustomColumn>;
    selectionMode?: 'single' | 'multiple';
};

export default function useDataTableQuery(props: UseDataTableQueryProps): UseDataTableQueryReturnProps {

    const [primaryKey, setPrimaryKey] = useState<string>("id");
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>(props?.selectionMode || 'single');
    const [columnVisibility, setColumnVisibility] = useState({})
    const [selected, setSelected] = useState<string | string[]>(selectionMode === 'multiple' ? [] : '');
    const [index, setIndex] = useState<number>(-1);
    const [initialize, setInitialize] = useState(false);
    const { query, customColumns } = props;
    const [rowSelection, setRowSelection] = useState({})  // selectionMode multiple /single

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
            let service = 'api/core/getResultQuery'
            let param = {};
            if ('serviceName' in query) { // Query
                service = query.serviceName;
                param = query.params;
            }
            else {
                param = query;
            }
            const result = await sendPost(service, param);
            const req: ResultQuery = result.data;
            setData(req.rows);
            readCustomColumns(req.columns);
            setColumns(req.columns);
            setPrimaryKey(req.primaryKey);

        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }


    const readCustomColumns = (_columns: Column[]) => {
        if (customColumns) {
            customColumns?.forEach(async (_column) => {
                const currentColumn = _columns.find((_col) => _col.name === _column.name.toLowerCase());
                if (currentColumn) {
                    currentColumn.visible = 'visible' in _column ? _column.visible : currentColumn.visible;
                    currentColumn.enableColumnFilter = 'filter' in _column ? _column.filter : currentColumn.enableColumnFilter;
                    currentColumn.enableSorting = 'orderable' in _column ? _column.orderable : currentColumn.enableSorting;
                    currentColumn.label = 'label' in _column ? _column?.label : currentColumn.label;
                    currentColumn.header = 'label' in _column ? _column?.label : currentColumn.label;
                    currentColumn.order = 'order' in _column ? _column.order : currentColumn.order;
                    currentColumn.decimals = 'decimals' in _column ? _column.decimals : currentColumn.decimals;
                    currentColumn.comment = 'comment' in _column ? _column.comment : currentColumn.comment;
                    currentColumn.upperCase = 'upperCase' in _column ? _column.upperCase : currentColumn.upperCase;
                    currentColumn.align = 'align' in _column ? _column.align : currentColumn.align;
                    currentColumn.size = 'size' in _column ? _column.size : currentColumn.size;
                }
                else {
                    throw new Error(`Error la columna ${_column.name} no existe`);
                }
            });
            // columnas visibles false
            const hiddenCols: any = {};
            _columns.filter((_col) => _col.visible === false).forEach(_element => {
                hiddenCols[_element.name] = false
            });
            setColumnVisibility(hiddenCols);
            // ordena las columnas
            _columns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1));

        }
    }

    return {
        data,
        index,
        setIndex,
        initialize,
        rowSelection,
        setRowSelection,
        setColumnVisibility,
        columns,
        primaryKey,
        loading,
        columnVisibility,
        selected,
        selectionMode,
        onRefresh,
        onSelectRow,
        onSelectionModeChange
    }
}
