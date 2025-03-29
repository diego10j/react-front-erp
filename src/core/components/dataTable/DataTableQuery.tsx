import type {
  FilterFn,
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
import { Box, Table, Skeleton, TableRow, TableBody, TableCell, TableContainer, TablePagination } from '@mui/material';

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
import { isDefined } from '../../../utils/common-util';
import { exportDataTableToExcel } from './exportDataTable';
import DataTablePopoverOptions from './DataTablePopoverOptions';
import { globalFilterFnImpl, numberFilterFnImpl, booleanFilterFnImpl } from './filterFn';

import type { Column, Options } from '../../types';
import type { DataTableQueryProps } from './types';

// ----------------------------------------------------------------------
declare module '@tanstack/table-core' {
  interface FilterFns {
    globalFilter: FilterFn<any>;
    numberFilterFn: FilterFn<unknown>;
    booleanFilterFn: FilterFn<unknown>;  // Para el filtro booleano
  }
}

const DataTableQuery = forwardRef(({
  useDataTableQuery,
  customColumns,
  eventsColumns = [],
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

  // const [order, setOrder] = useState(typeOrder);
  // const [orderBy, setOrderBy] = useState(defaultOrderBy);
  // const [globalFilter, setGlobalFilter] = useState('')

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
    sorting,
    pagination,
    paginationResponse,
    globalFilter,
    totalRecords,
    rows,
    setSorting,
    setPagination,
    setGlobalFilter,
    onSort,
    onPaginationChange,
    onGlobalFilterChange,
  } = useDataTableQuery;

  const { height: screenHeight } = useScreenSize();


  const table = useReactTable({
    data,
    columns,
    defaultColumn: QueryCell,
    columnResizeMode,
    // initialState: {
    //   pagination: {
    //     pageSize: rows
    //   },
    // },
    filterFns: {
      globalFilter: globalFilterFnImpl,
      numberFilterFn: numberFilterFnImpl,
      booleanFilterFn: booleanFilterFnImpl,
    },
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      columnFilters,
      globalFilter,
      pagination,
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
    onColumnFiltersChange: setColumnFilters,

    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // sort
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualSorting: !!paginationResponse,
    // pagination
    onPaginationChange: setPagination,
    manualPagination: !!paginationResponse,
    pageCount: paginationResponse?.totalPages,
    getPaginationRowModel: !paginationResponse ? getPaginationRowModel() : undefined,
    // globalFilter
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: globalFilterFnImpl,
    manualFiltering: totalRecords > rows,

    // debugTable: true,
    //    debugHeaders: true,
    //    debugColumns: true,
  });

  // const { pageSize, pageIndex } = table.getState().pagination

  const heightPagination = useMemo(() => showPagination ? 0 : 62, [showPagination]);
  const height = useMemo(() => isDefined(staticHeight)
    ? staticHeight
    : (screenHeight - (restHeight - heightPagination)), [staticHeight, screenHeight, heightPagination, restHeight]);


  const handleSort = useCallback((name: string) => {
    onSort(name);
  }, [onSort]);


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
        onDelete();
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
              onGlobalFilterChange={onGlobalFilterChange}
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
            overflow: 'auto', // Aseguramos que el scroll funcione
          })}
        >
          <Table
            stickyHeader
            size='small'
            sx={{
              minWidth: '100%', // Cambiamos width por minWidth
              width: table.getTotalSize(), // Usamos el ancho total calculado por react-table
            }}
          >
            <DataTableHeader
              table={table}
              displayIndex={displayIndex}
              selectionMode={selectionMode}
              orderable={orderable}
              showFilter={showFilter}
              onSort={handleSort}
              openFilters={openFilters}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              loading={columns.length === 0}
              skeletonColumns={numSkeletonCols}
            />

            {/* Body con skeleton corregido */}
            <TableBody ref={tableRef}>
              {initialize === false || isLoading === true ? (
                <>
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`} sx={{ width: '100%' }}>
                      {displayIndex && (
                        <TableCell sx={{ width: 40 }}> {/* Ancho fijo para columna índice */}
                          <Skeleton variant="text" height={heightSkeletonRow} />
                        </TableCell>
                      )}
                      {selectionMode === 'multiple' && (
                        <TableCell padding="checkbox" sx={{ width: 48 }}> {/* Ancho fijo para checkbox */}
                          <Skeleton variant="circular" width={24} height={24} />
                        </TableCell>
                      )}
                      {
                        // Verificamos si tenemos columnas definidas y visibles
                        columns && columns.length > 0 && table.getAllLeafColumns
                          ? table.getAllLeafColumns()
                            .filter(column => column.getIsVisible())
                            .map(column => (
                              <TableCell
                                key={`skeleton-col-${column.id}`}
                                sx={{
                                  width: column.getSize(),
                                  minWidth: column.getSize(),
                                }}
                              >
                                <Skeleton variant="text" height={heightSkeletonRow} />
                              </TableCell>
                            ))
                          : // Fallback cuando no hay columnas definidas
                          Array.from({ length: numSkeletonCols }).map((_1, i) => (
                            <TableCell key={`fallback-skeleton-${i}`}>
                              <Skeleton
                                variant="text"
                                width="100%"
                                height={heightSkeletonRow || 40}
                                animation="wave"
                              />
                            </TableCell>
                          ))
                      }
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {table.getRowModel().rows.map((row, _index) => (
                    <RowDataTable
                      key={row.id}
                      selectionMode={selectionMode}
                      showRowIndex={displayIndex}
                      row={row}
                      index={(_index + 1) + (pagination.pageIndex * pagination.pageSize)}
                      onSelectRow={() => { setIndex(_index); onSelectRow(String(row.id)); }}
                    />
                  ))}

                  {table.getRowModel().rows.length === 0 && (
                    <DataTableEmpty height={height} />
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {showPagination === true && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={
            paginationResponse
              ? paginationResponse.totalPages * pagination.pageSize
              : table.getFilteredRowModel().rows.length
          }
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}

          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onPageChange={(_, page) =>
            onPaginationChange({
              pageIndex: page,
              pageSize: pagination.pageSize,
            })
          }
          onRowsPerPageChange={(e) => {
            const newSize = Number(e.target.value);
            onPaginationChange({
              pageIndex: 0, // Resetear a primera página
              pageSize: newSize,
            });
          }}
        />
      )}

      <ConfigDataTable
        columns={columns}
        onColumnsChange={handleColumnsChange}
        open={configDataTable.value}
        onClose={configDataTable.onFalse}
      />

      {debug && (
        <DebugTable
          sx={{ display: 'block' }}
          table={table}
          totalRecords={totalRecords}
          setDebug={setDebug}
        />
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={
          <>
            {Object.keys(rowSelection).length === 1 ?
              '¿Realmente quieres eliminar el registro seleccionado?' :
              `¿Realmente quieres eliminar ${Object.keys(rowSelection).length} registros?`
            }
          </>
        }
        action={
          <LoadingButton loading={processing} variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </LoadingButton>
        }
      />
    </>
  );

});



export default DataTableQuery;

//        <TableContainer sx={{ maxHeight: `${height}px`, height: `${height}px` }}>                 <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize() }}>
