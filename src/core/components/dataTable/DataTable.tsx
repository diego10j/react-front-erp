import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
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
    getFacetedMinMaxValues
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
import RowEditable from './RowEditable';
import FilterColumn from './FilterColumn';
import DataTableEmpty from './DataTableEmpty';

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



const DataTable = forwardRef(({
    useDataTable,
    editable = false,
    rows = 25,
    customColumns,
    height = 378,
    typeOrder = 'asc',
    selectionMode = 'single',
    defaultOrderBy,
    numSkeletonCols = 5,
    showToolbar = true,
    showRowIndex = false,
    showSelectionMode = true,
    showSearch = true,
    showFilter = true, }: DataTableProps, ref) => {


    useImperativeHandle(ref, () => ({
        readCustomColumns
    }));

    const { data, columns,
        setColumns,
        loading,
        primaryKey,
        initialize,
        columnVisibility,
        setColumnVisibility,
        selected,
        rowSelection,
        setRowSelection,
        // events
        onRefresh,
        onSelectRow,
        onSelectAllRows,
        onSelectionModeChange } = useDataTable;

    const columnResizeMode: ColumnResizeMode = 'onChange';
    const [sorting, setSorting] = useState<SortingState>([])
    const [order, setOrder] = useState(typeOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);


    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const [openFilters, setOpenFilters] = useState(false);
    const [displayIndex, setDisplayIndex] = useState(showRowIndex);

    const tableRef = useRef(null);


    const table = useReactTable({
        data,
        columns,
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
        // enableRowSelection: true, // enable row selection for all rows
        // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),

        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),

        debugTable: true,
        //    debugHeaders: true,
        //    debugColumns: true,
    });


    useEffect(() => {
        table.setPageSize(rows);
        onSort(defaultOrderBy || '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if (initialize === true) {
            // Solo lee si no se a inicializado la data
            readCustomColumns();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialize]);



    /**
 * Lee las columnas customizadas, esta función se llama desde el useFormTable
 * @param _columns 
 * @returns 
 */
    const readCustomColumns = (): void => {
        if (customColumns) {
            customColumns?.forEach(async (_column) => {
                const currentColumn = columns.find((_col) => _col.name === _column.name.toLowerCase());
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

                    if ('dropDown' in _column) {
                        currentColumn.dropDown = _column.dropDown;
                        currentColumn.component = 'Dropdown'
                    }

                    if ('radioGroup' in _column) {
                        currentColumn.radioGroup = _column.radioGroup;
                        currentColumn.component = 'RadioGroup'
                    }

                    currentColumn.onChange = 'onChange' in _column ? _column.onChange : undefined;
                    setColumns(oldArray => [...oldArray, currentColumn]);
                }
                else {
                    throw new Error(`ERROR. la columna ${_column.name} no existe`);
                }
            });
            // columnas visibles false
            const hiddenCols: any = {};
            columns.filter((_col) => _col.visible === false).forEach(_element => {
                hiddenCols[_element.name] = false
            });
            setColumnVisibility(hiddenCols);
            // ordena las columnas
            setColumns(columns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1)));

        }

    }


    const onSort = (name: string) => {
        const isAsc = orderBy === name && order === 'asc';
        if (name !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(name);
        }
        setSorting([{ id: name, desc: isAsc }])
    };

    const onExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        // let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        // XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    };


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
                    openFilters={openFilters}
                    setOpenFilters={setOpenFilters}
                    setDisplayIndex={setDisplayIndex}
                    setColumnFilters={setColumnFilters}
                    showSearch={showSearch}
                    showSelectionMode={showSelectionMode}
                    onRefresh={onRefresh}
                    onExportExcel={onExportExcel}
                    onSelectionModeChange={onSelectionModeChange} />
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
                                                        {(header.column.getCanSort()) ? (<TableSortLabel
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
                                {table.getRowModel().rows.map((row, index) => (
                                    <RowEditable
                                        key={row.id}
                                        selectionMode={selectionMode}
                                        showRowIndex={displayIndex}
                                        row={row}
                                        index={index}
                                        onSelectRow={() => onSelectRow(String(row.getValue(primaryKey)))}
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
        </ >
    );

});
export default DataTable;