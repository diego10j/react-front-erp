import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
    flexRender,
    ColumnResizeMode,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TableSortLabel } from '@mui/material';
import { DataTableQueryProps } from './types';
import DataTablePaginationActions from './DataTablePaginationActions'
import DataTableSkeleton from './DataTableSkeleton';
import DataTableToolbar from './DataTableToolbar'

const ResizeColumn = styled('div')(({ theme }) => ({
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: '1px',
    background: theme.palette.divider,
    userSelect: 'none',
    touchAtion: 'none',
    cursor: 'col-resize',
    justifyContent: 'flex-start',
    flexDirection: 'inherit',
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: ` ${theme.palette.mode === 'light' ? '#fbfbfb' : '#252f3b'}`
    },
    '&:hover': {
        backgroundColor: theme.palette.action.focus
    }
}));


export default function DataTableQuery({
    data = [],
    columns = [],
    loading,
    rows = 25,
    columnVisibility,
    typeOrder = 'asc',
    defaultOrderBy,
    numSkeletonCols = 5,
    showToolbar = true,
    // events
    onRefresh
}: DataTableQueryProps) {

    const columnResizeMode: ColumnResizeMode = 'onChange';
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [order, setOrder] = useState(typeOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);


    const table = useReactTable({
        data,
        columns,
        columnResizeMode,
        state: {
            columnVisibility,
            sorting,
            globalFilter
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
       // globalFilterFn: "contains",
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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
                <DataTableToolbar type='DataTableQuery' onRefresh={onRefresh} />
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
                                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
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
                                {table.getRowModel().rows.map(row => (
                                    <StyledTableRow key={row.id}>
                                        {row.getVisibleCells().map((cell: any) => (
                                            <TableCell key={cell.id}
                                                sx={{
                                                    textAlign: `${cell.column.columnDef.align} !important`,
                                                    width: cell.column.getSize(),
                                                }}
                                                align={cell.column.columnDef.align}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </StyledTableRow>
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