import { useEffect, useCallback, useState, useRef, forwardRef, useImperativeHandle } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
    flexRender,
    ColumnResizeMode,
    getCoreRowModel,
    getFilteredRowModel,
    FilterFn,
    getSortedRowModel,
    SortingState,
    FilterFns,
    ColumnFiltersState,
    getPaginationRowModel,
    useReactTable,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    RowData,
    Row,
} from '@tanstack/react-table'

import {
    RankingInfo,
    rankItem,
} from '@tanstack/match-sorter-utils'
import * as XLSX from 'xlsx';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TableSortLabel, Checkbox, Slide } from '@mui/material';
import { DataTableProps } from './types';
import DataTablePaginationActions from './DataTablePaginationActions'
import DataTableSkeleton from './DataTableSkeleton';
import DataTableToolbar from './DataTableToolbar'
import RowEditable from './RowDataTable';
import FilterColumn from './FilterColumn';
import DataTableEmpty from './DataTableEmpty';
import EditableCell from './EditableCell';
import { Options, EventColumn } from '../../types';
import { isDefined } from '../../../utils/commonUtil';



const ResizeColumn = styled('div')(({ theme }) => ({
    position: 'absolute',
    border: 'none',
    right: 0,
    top: 0,
    height: '100%',
    width: '1px',
    background: theme.palette.divider,
    userSelect: 'none',
    touchAction: 'none',
    cursor: 'col-resize',
    justifyContent: 'flex-start',
    flexDirection: 'inherit',
}));


declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}


const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}


// ----
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        optionsColumn: Map<string, Options[]>;
        eventsColumns: EventColumn[];
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
        updateDataByRow: (rowIndex: number, newRow: any) => void
    }
}



function useSkipper() {
    const shouldSkipRef = useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}

// ----


const DataTable = forwardRef(({
    useDataTable,
    editable = true,
    rows = 25,
    customColumns,
    eventsColumns = [],
    height = 378,
    typeOrder = 'asc',
    //  defaultOrderBy,
    numSkeletonCols = 5,
    showToolbar = true,
    showRowIndex = false,
    showSelectionMode = true,
    showSearch = true,
    showFilter = true,
    showInsert = true
}: DataTableProps, ref) => {


    useImperativeHandle(ref, () => ({
        customColumns,
        table,
        columns,
        data,
        index
    }));

    const { data,
        columns,
        setData,
        optionsColumn,
        index,
        setIndex,
        loading,
        primaryKey,
        initialize,
        columnVisibility,
        selected,
        rowSelection,
        setRowSelection,
        // events
        onRefresh,
        onSelectRow,
        selectionMode,
        onSelectionModeChange,
        insertRow,
        deleteRow,
    } = useDataTable;

    const columnResizeMode: ColumnResizeMode = 'onChange';
    const [sorting, setSorting] = useState<SortingState>([])
    const [order, setOrder] = useState(typeOrder);
    const [orderBy, setOrderBy] = useState(''); // defaultOrderBy || ''
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const [openFilters, setOpenFilters] = useState(false);
    const [displayIndex, setDisplayIndex] = useState(showRowIndex);

    const tableRef = useRef(null);



    const table = useReactTable({
        data,
        columns,
        defaultColumn: EditableCell,
        columnResizeMode,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            rowSelection,
            columnVisibility,
            sorting,
            columnFilters,
            globalFilter,
        },
        meta: {
            optionsColumn,   // Options para Dropdown
            eventsColumns,   // Para acceder desde  EditableCell
            updateData: (rowIndex, columnId, value) => {
                // Verifica que hayan cambios en la data

                // if (rowIndex !== index)
                // setIndex(rowIndex);

                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setData(old =>
                    old.map((_row, _index) => {
                        if (_index === rowIndex) {
                            // si no es fila insertada
                            if (!isDefined(_row.insert)) {
                                _row.update = true;
                                const colsUpdate = _row?.colsUpdate || [];
                                if (colsUpdate.indexOf(columnId) === -1)
                                    colsUpdate.push(columnId);
                                _row.colsUpdate = colsUpdate;
                            }
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return _row
                    })
                )

            },

            updateDataByRow: async (rowIndex, newRow) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                await setData((old) =>
                    old.map((_row, _index) => {
                        if (_index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                ...newRow
                            };
                        }
                        return _row;
                    })
                )
            },

        },
        // enableRowSelection: true, // enable row selection for all rows
        // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        autoResetPageIndex,
        getFilteredRowModel: getFilteredRowModel(),

        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),

        // debugTable: true,
        // debugHeaders: true,
        // debugColumns: true,
    });


    const selectedRows = table.getSelectedRowModel().flatRows.map(
        (row: { original: any; }) => row.original
    );

    // useEffect(() => {
    //      if (initialize === true) {
    //                setOrderBy(defaultOrderBy || primaryKey);
    //           table.setPageSize(rows);
    //                onSort(defaultOrderBy || primaryKey);
    //       }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, [initialize]);

    const onSort = (name: string) => {
        const isAsc = orderBy === name && order === 'asc';
        if (name !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(name);
            setSorting([{ id: name, desc: isAsc }])
        }
    };



    const onExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        // let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        // XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    };


    const handleInsert = () => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setSorting([]);
        setColumnFilters([]);
        setGlobalFilter('');
        return insertRow();
    };

    const handleRefresh = () => {
        // table.reset(); ***probar
        setSorting([]);
        setColumnFilters([]);
        setGlobalFilter('');
        onRefresh();
    }

    const { pageSize, pageIndex } = table.getState().pagination

    return (
        <>
            {showToolbar === true && (
                <DataTableToolbar type='DataTableQuery'
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    selectionMode={selectionMode}
                    showFilter={showFilter}
                    showRowIndex={displayIndex}
                    showInsert={showInsert}
                    openFilters={openFilters}
                    setOpenFilters={setOpenFilters}
                    setDisplayIndex={setDisplayIndex}
                    setColumnFilters={setColumnFilters}
                    showSearch={showSearch}
                    showSelectionMode={showSelectionMode}
                    onRefresh={handleRefresh}
                    onExportExcel={onExportExcel}
                    onSelectionModeChange={onSelectionModeChange}
                    onInsert={handleInsert} />
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: `${height}px`, height: `${height}px` }}>
                    {initialize === false || loading === true ? (
                        <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} />
                    ) : (

                        <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize() }}>
                            <TableHead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>

                                        {displayIndex && <TableCell sx={{ minWidth: 45 }} > #
                                        </TableCell>
                                        }

                                        {selectionMode === 'multiple' && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={table.getIsAllRowsSelected()}
                                                    indeterminate={table.getIsSomeRowsSelected()}
                                                    onChange={table.getToggleAllRowsSelectedHandler()}
                                                />
                                            </TableCell>
                                        )}

                                        {headerGroup.headers.map((header: any) => (
                                            <TableCell key={header.id} colSpan={header.colSpan}
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    textAlign: 'center',
                                                    width: header.getSize(),
                                                    minWidth: header.getSize()
                                                }}
                                                sortDirection={orderBy === header.column.columnDef.name ? order : false}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <>
                                                        {(header.column.getCanSort()) ? (
                                                            <TableSortLabel
                                                                hideSortIcon
                                                                active={orderBy === header.column.columnDef.name}
                                                                direction={orderBy === header.column.columnDef.name ? order : 'asc'}
                                                                onClick={() => { onSort(header.column.columnDef.name) }}
                                                            >
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </TableSortLabel>) : (
                                                            <>
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                <ResizeColumn
                                                    {...{
                                                        onMouseDown: header.getResizeHandler(),
                                                        onTouchStart: header.getResizeHandler(),
                                                    }}
                                                />
                                                {(showFilter && header.column.getCanFilter() && openFilters) && (
                                                    <Slide direction='left' in={openFilters} mountOnEnter unmountOnExit>
                                                        <div>
                                                            <FilterColumn column={header.column} table={table} />
                                                        </div>
                                                    </Slide>
                                                )}

                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody ref={tableRef}>
                                {table.getRowModel().rows.map((row, _index) => (
                                    <RowEditable
                                        key={row.id}
                                        selectionMode={selectionMode}
                                        showRowIndex={displayIndex}
                                        row={row}
                                        index={_index}
                                        onSelectRow={() => { setIndex(_index); onSelectRow(String(row.id)); }}
                                    />
                                ))}

                                {table.getRowModel().rows.length === 0 && (
                                    <DataTableEmpty />
                                )}
                            </TableBody>
                        </Table>

                    )}
                </TableContainer>
            </Paper>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={table.getFilteredRowModel().rows.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                }}
                onPageChange={(_, page) => {
                    table.setPageIndex(page)
                }}
                onRowsPerPageChange={e => {
                    const size = e.target.value ? Number(e.target.value) : 10
                    table.setPageSize(size)
                }}
                ActionsComponent={DataTablePaginationActions}
            />
            <div>
                <pre>{JSON.stringify(rowSelection, null, 2)}</pre>
            </div>

        </ >
    );

});
export default DataTable;