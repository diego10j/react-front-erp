
import { useReducer, useState } from 'react';
import {

    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataTableQueryProps } from './types';




export default function DataTableQuery<T extends object>({
    data = [],
    columns,
    columnsDef = [],
    loading,
}: DataTableQueryProps<T>) {





    const rerender = useReducer(() => ({}), {})[1]

    const table = useReactTable({
        data,
        columns: columnsDef,
        getCoreRowModel: getCoreRowModel(),
    })


    return (
        <div>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableCell key={header.id} align='left'>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
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
            </TableContainer>
            <div className="h-4" />
            <button type='button' onClick={() => rerender()} className="border p-2">        Rerender      </button>
        </div>
    );
}
