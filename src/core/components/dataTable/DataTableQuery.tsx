import { useEffect, useState } from 'react';
import {
    Column,
    Table as ReactTable,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
    useReactTable
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, InputBase, TableSortLabel } from '@mui/material';
import Scrollbar from '../../../components/scrollbar';
import { DataTableQueryProps } from './types';
import TablePaginationActions from './TablePaginationActions'
import DataTableSkeleton from './DataTableSkeleton';


export default function DataTableQuery({
    data = [],
    columns = [],
    loading,
    rows = 25,
    columnVisibility,
    typeOrder = 'asc',
    defaultOrderBy,
    numSkeletonCols = 5

}: DataTableQueryProps) {


    const [sorting, setSorting] = useState<SortingState>([])
    const [order, setOrder] = useState(typeOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);

    const table = useReactTable({
        data,
        columns,
        state: {
            columnVisibility,
            sorting
        },
        onSortingChange: setSorting,
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
        <Scrollbar>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                {loading ? (
                    <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} />
                ) : (
                    <Table size='small' sx={{ minWidth: 960 }}>
                        <TableHead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header: any) => (
                                        <TableCell key={header.id} colSpan={header.colSpan}
                                            sx={{ textTransform: 'capitalize' }}
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
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
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
                ActionsComponent={TablePaginationActions}
            />
        </Scrollbar >
    );
}

