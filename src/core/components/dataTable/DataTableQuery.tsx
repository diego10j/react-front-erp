import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { DataTableQueryProps } from './types';
import DataTablePaginationActions from './DataTablePaginationActions'
import DataTableSkeleton from './DataTableSkeleton';
import DataTableToolbar from './DataTableToolbar'
import TableRowQuery from './TableRowQuery';
import FilterColumn from './FilterColumn';
import DataTableEmpty from './DataTableEmpty';
import QueryCell from './QueryCell';

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


const DataTableQuery = forwardRef(({
    useDataTableQuery,
    rows = 25,
    customColumns,
    height = 380,
    typeOrder = 'asc',
    defaultOrderBy,
    numSkeletonCols = 5,
    showToolbar = true,
    showRowIndex = false,
    showSelectionMode = true,
    showSearch = true,
    showFilter = true,
    actionToolbar,
}: DataTableQueryProps, ref) => {

    useImperativeHandle(ref, () => ({
        customColumns,
        table,
        columns,
        data,
        index
    }));

    const columnResizeMode: ColumnResizeMode = 'onChange';
    const [sorting, setSorting] = useState<SortingState>([])
    const [order, setOrder] = useState(typeOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const [openFilters, setOpenFilters] = useState(false);
    const [displayIndex, setDisplayIndex] = useState(showRowIndex);

    const tableRef = useRef(null);


    const { data,
        columns,
        setIndex,
        loading,
        index,
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
    } = useDataTableQuery;

    const table = useReactTable({
        data,
        columns,
        defaultColumn: QueryCell,
        columnResizeMode,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnVisibility,
            sorting,
            columnFilters,
            globalFilter,
        },
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

        // debugTable: true,
        //    debugHeaders: true,
        //    debugColumns: true,
    });


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
                    showInsert={false}
                    initialize={initialize}
                    openFilters={openFilters}
                    setOpenFilters={setOpenFilters}
                    setDisplayIndex={setDisplayIndex}
                    setColumnFilters={setColumnFilters}
                    showSearch={showSearch}
                    showSelectionMode={showSelectionMode}
                    onRefresh={onRefresh}
                    onExportExcel={onExportExcel}
                    onSelectionModeChange={onSelectionModeChange}
                    children={actionToolbar} />
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: `${height}px`, height: `${height}px` }}>
                    {initialize === false || loading === true ? (
                        <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} />
                    ) : (

                        <Table stickyHeader size='small' sx={{ width: '100% !important' }}>
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
                                {table.getRowModel().rows.map((row, _index) => (
                                    <TableRowQuery
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
        </ >
    );


});



export default DataTableQuery;

//                        <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize() }}>
