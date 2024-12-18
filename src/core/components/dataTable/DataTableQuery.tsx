

import type {
  FilterFn,
  SortingState,
  ColumnResizeMode
} from '@tanstack/react-table';

import { useRef, useMemo, useState, forwardRef, useCallback, useImperativeHandle } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues
} from '@tanstack/react-table'

import { LoadingButton } from '@mui/lab';
import { Box, Table, TableBody, TableContainer, TablePagination } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useScreenSize } from 'src/hooks/use-responsive';

import { varAlpha } from 'src/theme/styles';

import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import QueryCell from './QueryCell';
import RowDataTable from './RowDataTable';
import { DebugTable } from './DebugTable';
import DataTableEmpty from './DataTableEmpty';
import ConfigDataTable from './ConfigDataTable';
import DataTableHeader from './DataTableHeader';
import DataTableToolbar from './DataTableToolbar'
import DataTableSkeleton from './DataTableSkeleton';
import { isDefined } from '../../../utils/common-util';
import { exportDataTableToExcel } from './exportDataTable';
import DataTablePopoverOptions from './DataTablePopoverOptions';
import DataTablePaginationActions from './DataTablePaginationActions'
import { globalFilterFnImpl, numberFilterFnImpl, booleanFilterFnImpl } from './filterFn';

import type { Column, Options } from '../../types';
import type { DataTableQueryProps } from './types';

// ----------------------------------------------------------------------
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
    index,
  }));

  const columnResizeMode: ColumnResizeMode = 'onChange';
  const [sorting, setSorting] = useState<SortingState>([])
  const [order, setOrder] = useState(typeOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [globalFilter, setGlobalFilter] = useState('')

  const [openFilters, setOpenFilters] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(showRowIndex);

  const tableRef = useRef(null);
  const configDataTable = useBoolean();

  const confirm = useBoolean();
  const popover = usePopover();
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
    columnFilters,
    setRowSelection,
    setColumnVisibility,
    setColumns,
    setColumnFilters,
    // events
    onRefresh,
    onSelectRow,
    selectionMode,
    onSelectionModeChange,
  } = useDataTableQuery;

  const { height: screenHeight } = useScreenSize();


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
    globalFilterFn: globalFilterFnImpl,
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

  const { pageSize, pageIndex } = table.getState().pagination

  const heightPagination = useMemo(() => showPagination ? 0 : 62, [showPagination]);
  const height = useMemo(() => isDefined(staticHeight)
    ? staticHeight
    : (screenHeight - (restHeight - heightPagination)), [staticHeight, screenHeight, heightPagination, restHeight]);


  const onSort = useCallback((name: string) => {
    const isAsc = orderBy === name && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(name);
    setSorting([{ id: name, desc: isAsc }]);
  }, [orderBy, order]);


  const handleExportExcel = useCallback(() => {
    exportDataTableToExcel(columns, data);
    popover.onClose();
  }, [columns, data, popover]);


  const handleRefresh = useCallback(() => {
    // table.reset();
    onRefresh();
    popover.onClose();
  }, [onRefresh, popover]);

  const handleOpenConfig = useCallback(() => {
    configDataTable.onTrue();
  }, [configDataTable]);


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

  const onDeleteRow = useCallback(async () => {
    try {
      if (onDelete) {
        await onDelete();
      }
      confirm.onFalse();
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  }, [onDelete, confirm]);


  const handleOpenConfirmDelete = useCallback(() => {
    confirm.onTrue();
  }, [confirm]);

  return (
    <>

      <Box sx={{ position: 'relative' }}>
        {showToolbar === true && (
          <>
            <DataTableToolbar
              type='DataTableQuery'
              popover={popover}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showFilter={showFilter}
              rowSelection={rowSelection}
              showInsert={false}
              showDelete={showDelete}
              showOptions={showOptions}
              initialize={initialize}
              openFilters={openFilters}
              setOpenFilters={setOpenFilters}
              setColumnFilters={setColumnFilters}
              showSearch={showSearch}
              children={actionToolbar}
              onDelete={handleOpenConfirmDelete}
            />

            <DataTablePopoverOptions
              popover={popover}
              showSelectionMode={showSelectionMode}
              selectionMode={selectionMode}
              showRowIndex={showRowIndex}
              debug={debug}
              setDebug={setDebug}
              setDisplayIndex={setDisplayIndex}
              onSelectionModeChange={onSelectionModeChange}
              onRefresh={handleRefresh}
              onExportExcel={handleExportExcel}
              onOpenConfig={handleOpenConfig}
            />
          </>
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
              <DataTableHeader
                table={table}
                displayIndex={displayIndex}
                selectionMode={selectionMode}
                orderBy={orderBy}
                orderable={orderable}
                order={order}
                showFilter={showFilter}
                onSort={onSort}
                openFilters={openFilters}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
              />
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
      <ConfigDataTable
        columns={columns}
        onColumnsChange={handleColumnsChange}
        open={configDataTable.value}
        onClose={configDataTable.onFalse}
      />

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
