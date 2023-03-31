import { useEffect, useState } from 'react';
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
} from '@tanstack/react-table'

import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'


import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TableSortLabel, Checkbox } from '@mui/material';
import { DataTableQueryProps } from './types';
import DataTablePaginationActions from './DataTablePaginationActions'
import DataTableSkeleton from './DataTableSkeleton';
import DataTableToolbar from './DataTableToolbar'
import TableRowQuery from './TableRowQuery';

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


export default function DataTableQuery({
    data = [],
    columns = [],
    loading,
    rows = 25,
    columnVisibility,
    typeOrder = 'asc',
    selectionMode = 'single',
    defaultOrderBy,
    numSkeletonCols = 5,
    showToolbar = true,
    showRowIndex = true,
    showSelectionMode = true,
    showSearch = true,
    showFilter = true,
    selected,
    // events
    onRefresh,
    onSelectRow,
    onSelectAllRows,
    onSelectionModeChange
}: DataTableQueryProps) {

    const columnResizeMode: ColumnResizeMode = 'onChange';
    const [sorting, setSorting] = useState<SortingState>([])
    const [order, setOrder] = useState(typeOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);


    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = useState('')



    const table = useReactTable({
        data,
        columns,
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
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),

        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // debugTable: true,
        //    debugHeaders: true,
        //    debugColumns: true,
    });


    useEffect(() => {
        table.setPageSize(rows);
        onSort(defaultOrderBy || '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const onSort = (name: string) => {
        const isAsc = orderBy === name && order === 'asc';
        if (name !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(name);
        }
        setSorting([{ id: name, desc: isAsc }])
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
                    showSearch={showSearch}
                    showSelectionMode={showSelectionMode}
                    onRefresh={onRefresh}
                    onSelectionModeChange={onSelectionModeChange} />
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 378 }}>
                    {loading ? (
                        <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} />
                    ) : (

                        <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize() }}>
                            <TableHead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>

                                        {showRowIndex && <TableCell sx={{ minWidth: 45 }} > #
                                        </TableCell>
                                        }

                                        {selectionMode === 'multiple' && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selected.length > 0 && selected.length < table.getRowModel().rows.length}
                                                    checked={table.getRowModel().rows.length > 0 && selected.length === table.getRowModel().rows.length}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        onSelectAllRows(event.target.checked, event.target.checked ? (table.getRowModel().rows.map((row) => row.id)) : []
                                                        )} />
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
                                                    </TableSortLabel>

                                                )}

                                                <ResizeColumn
                                                    {...{
                                                        onMouseDown: header.getResizeHandler(),
                                                        onTouchStart: header.getResizeHandler(),
                                                    }}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map((row, index) => (
                                    <TableRowQuery
                                        key={row.id}
                                        selectionMode={selectionMode}
                                        showRowIndex={showRowIndex}
                                        row={row}
                                        index={index}
                                        selected={selectionMode === 'multiple' ? selected.includes(row.id) : selected === row.id}
                                        onSelectRow={() => onSelectRow(row.id)}
                                    />
                                ))}
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
}

// align={cell.column.columnDef?.align}