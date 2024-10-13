

import type {
  FilterFn,
  SortingState,
  ColumnResizeMode,
  ColumnFiltersState
} from '@tanstack/react-table';

import * as XLSX from 'xlsx';
import { useRef, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues
} from '@tanstack/react-table'

import { LoadingButton } from '@mui/lab';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Table, Slide, TableRow, Checkbox, TableBody, TableCell, TableHead, TableContainer, TableSortLabel, TablePagination } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useScreenHeight } from 'src/hooks/use-responsive';

import { varAlpha } from 'src/theme/styles';

import { ConfirmDialog } from 'src/components/custom-dialog';

import QueryCell from './QueryCell';
import RowDataTable from './RowDataTable';
import FilterColumn from './FilterColumn';
import { DebugTable } from './DebugTable';
import DataTableEmpty from './DataTableEmpty';
import ConfigDataTable from './ConfigDataTable';
import DataTableToolbar from './DataTableToolbar'
import DataTableSkeleton from './DataTableSkeleton';
import { isDefined } from '../../../utils/common-util';
import DataTablePaginationActions from './DataTablePaginationActions'
import { globalFilterFnImpl, numberFilterFnImpl, booleanFilterFnImpl } from './filterFn';

import type { Column, Options } from '../../types';
import type { DataTableQueryProps } from './types';

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
    numberFilterFn: FilterFn<unknown>;
    booleanFilterFn: FilterFn<unknown>;  // Para el filtro booleano
  }
}


const DataTableQuery = forwardRef(({
  useDataTableQuery,
  rows = 50,
  customColumns,
  eventsColumns = [],
  typeOrder = 'asc',
  defaultOrderBy,
  numSkeletonCols = 4,
  heightSkeletonRow = 35,
  showToolbar = true,
  showPagination = true,
  showRowIndex = false,
  showSelectionMode = true,
  showDelete = false,
  showSearch = true,
  showFilter = true,
  showOptions = true,
  actionToolbar,
  orderable = true,
  restHeight = 360,  // valor defecto para 1 tabla en la pantalla
  staticHeight,
  onDelete,
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
  const configDataTable = useBoolean();

  const confirm = useBoolean();

  const [debug, setDebug] = useState(false);

  const { data,
    columns,
    setIndex,
    isLoading,
    processing,
    index,
    // primaryKey,
    initialize,
    columnVisibility,
    //  selected,
    rowSelection,
    setRowSelection,
    setColumnVisibility,
    setColumns,
    // events
    onRefresh,
    onSelectRow,
    selectionMode,
    onSelectionModeChange,
  } = useDataTableQuery;

  const screenHeight = useScreenHeight();


  const table = useReactTable({
    data,
    columns,
    defaultColumn: QueryCell,
    columnResizeMode,
    initialState: {
      pagination: {
        pageSize: rows
      },
    },
    filterFns: {
      numberFilterFn: numberFilterFnImpl,
      booleanFilterFn: booleanFilterFnImpl,
    },
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      readOnly: true,
      eventsColumns,
      editingCell: undefined,
      handleEditCell: (rowIndex: number, columnId: string) => {
      },
      removeErrorCells: (rowIndex: number, columnId: string) => {
      },
      optionsColumn: new Map<string, Options[]>,
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
      },
      updateDataByRow: (rowIndex: number, newRow: any) => {
      },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn:globalFilterFnImpl,
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

  const heightPagination = useMemo(() => showPagination ? 0 : 62, [showPagination]);
  const height = useMemo(() => isDefined(staticHeight) ? staticHeight : (screenHeight - (restHeight - heightPagination)), [staticHeight, screenHeight, heightPagination, restHeight]);


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

  const handleOpenConfig = () => {
    configDataTable.onTrue();
  };

  const handleColumnsChange = (newColumns: Column[]) => {
    // columnas visibles false
    const hiddenCols = newColumns.reduce((acc, _col) => {
      if (!_col.visible) {
        acc[_col.name] = false;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setColumnVisibility(hiddenCols);
    setColumns(newColumns);
  };

  const { pageSize, pageIndex } = table.getState().pagination

  const onDeleteRow = async () => {
    if (onDelete) {
      await onDelete();
    }
    confirm.onFalse();
  }

  const handleOpenConfirmDelete = () => {
    confirm.onTrue();
  }

  return (
    <>

      <Box sx={{ position: 'relative' }}>
        {showToolbar === true && (
          <DataTableToolbar type='DataTableQuery'
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            selectionMode={selectionMode}
            showFilter={showFilter}
            showRowIndex={displayIndex}
            rowSelection={rowSelection}
            showInsert={false}
            showDelete={showDelete}
            showOptions={showOptions}
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
            children={actionToolbar}
            onOpenConfig={handleOpenConfig}
            onDelete={handleOpenConfirmDelete}
            debug={debug}
            setDebug={setDebug}
          />
        )}
        <TableContainer
          sx={(theme) => ({
            maxHeight: `${height}px`,
            height: `${height}px`,
            border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          })}
        >
          {initialize === false || isLoading === true ? (
            <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} heightRow={heightSkeletonRow} />
          ) : (

            <Table stickyHeader size='small' sx={{ width: '100% !important' }}>
              <TableHead>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>

                    {displayIndex && <TableCell sx={{ width: 8, maxWidth: 12 }} > #
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
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          textTransform: 'capitalize',
                          textAlign: 'center',
                          width: header.getSize(),
                          minWidth: header.getSize()
                        }}
                        sortDirection={orderBy === header.column.columnDef.name ? order : false}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {(orderable === true && header.column.getCanSort()) ? (<TableSortLabel
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
                              <FilterColumn column={header.column} columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
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
                  <RowDataTable
                    key={row.id}
                    selectionMode={selectionMode}
                    showRowIndex={displayIndex}
                    row={row}
                    index={(_index + 1) + (pageIndex * pageSize)}
                    onSelectRow={() => { setIndex(_index); onSelectRow(String(row.id)); }}
                  />
                ))}

                {table.getRowModel().rows.length === 0 && (
                  <DataTableEmpty height={height} />
                )}


              </TableBody>
              {/* <TableFooter >
                <TableRow>
                  <TableCell rowSpan={2} />
                  <TableCell align="right">10</TableCell>
                </TableRow>
              </TableFooter> */}
            </Table>

          )}
        </TableContainer>
      </Box>
      {(showPagination === true) && (
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
      )}
      <ConfigDataTable columns={columns} onColumnsChange={handleColumnsChange} open={configDataTable.value} onClose={configDataTable.onFalse} />

      {debug &&
        <DebugTable
          sx={{ display: 'block' }}
          table={table}
          setDebug={setDebug}
        />
      }

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={
          <>
            {Object.keys(rowSelection).length === 1 ? '¿Realmemte quieres eliminar el registro seleccionado?' : `¿Realmemte quieres eliminar ${Object.keys(rowSelection).length} registros?`}
          </>
        }
        action={
          <LoadingButton loading={processing} variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </LoadingButton>
        }
      />
    </ >
  );


});



export default DataTableQuery;

//        <TableContainer sx={{ maxHeight: `${height}px`, height: `${height}px` }}>                 <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize() }}>
