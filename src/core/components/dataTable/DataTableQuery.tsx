import { useEffect, useState, useRef } from 'react';
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
    primaryKey,
    rows = 25,
    columnVisibility,
    typeOrder = 'asc',
    selectionMode = 'single',
    defaultOrderBy,
    numSkeletonCols = 5,
    showToolbar = true,
    showRowIndex = false,
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

        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),

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
                    showSearch={showSearch}
                    showSelectionMode={showSelectionMode}
                    onRefresh={onRefresh}
                    onExportExcel={onExportExcel}
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

                                        {displayIndex && <TableCell sx={{ minWidth: 45 }} > #
                                        </TableCell>
                                        }

                                        {selectionMode === 'multiple' && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selected.length > 0 && selected.length < table.getRowModel().rows.length}
                                                    checked={table.getRowModel().rows.length > 0 && selected.length === table.getRowModel().rows.length}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        onSelectAllRows(event.target.checked, event.target.checked ? (table.getRowModel().rows.map((row) => String(row.getValue(primaryKey)))) : []
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
                                    <TableRowQuery
                                        key={row.id}
                                        selectionMode={selectionMode}
                                        showRowIndex={displayIndex}
                                        row={row}
                                        index={index}
                                        selected={selectionMode === 'multiple' ? selected.includes(String(row.getValue(primaryKey))) : selected === String(row.getValue(primaryKey))}
                                        onSelectRow={() => onSelectRow(String(row.getValue(primaryKey)))}
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



