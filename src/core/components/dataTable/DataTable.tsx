import type {
  RowData,
  FilterFn,
  SortingState,
  ColumnResizeMode,
  ColumnFiltersState
} from '@tanstack/react-table';

import { useRef, useMemo, useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'

// @mui
import { Box, Table, Button, TableBody, TableContainer, TablePagination } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useScreenSize } from 'src/hooks/use-responsive';

import { varAlpha } from 'src/theme/styles';

import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import RowDataTable from './RowDataTable';
import { DebugTable } from './DebugTable';
import EditableCell from './EditableCell';
import DataTableEmpty from './DataTableEmpty';
import DataTableHeader from './DataTableHeader';
import ConfigDataTable from './ConfigDataTable';
import DataTableToolbar from './DataTableToolbar'
import DataTableSkeleton from './DataTableSkeleton';
import { isDefined } from '../../../utils/common-util';
import { exportDataTableToExcel } from './exportDataTable';
import DataTablePopoverOptions from './DataTablePopoverOptions';
import DataTablePaginationActions from './DataTablePaginationActions'
import { numberFilterFnImpl, globalFilterFnImpl, booleanFilterFnImpl } from './filterFn';

import type { DataTableProps } from './types';
import type { Column, Options, EventColumn } from '../../types';



declare module '@tanstack/table-core' {
  interface FilterFns {
    numberFilterFn: FilterFn<unknown>;
    booleanFilterFn: FilterFn<unknown>;  // Para el filtro booleano
  }
}
// ----
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    readOnly: boolean;
    optionsColumn: Map<string, Options[]>;
    editingCell: { rowIndex: number, columnId: string } | undefined;
    handleEditCell: (rowIndex: number, columnId: string) => void
    removeErrorCells: (rowIndex: number, columnId: string) => void
    eventsColumns: EventColumn[];
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    updateDataByRow: (rowIndex: number, newRow: any) => void
  }
}



function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

// ----


const DataTable = forwardRef(({
  useDataTable,
  editable = true,
  rows = 50,
  customColumns,
  eventsColumns = [],
  numSkeletonCols = 5,
  showToolbar = true,
  showRowIndex = false,
  showSelectionMode = true,
  showSearch = true,
  showFilter = true,
  showInsert = true,
  showDelete = true,
  showPagination = true,
  showOptions = true,
  orderable = true,
  restHeight = 320,  // valor defecto para 1 tabla en la pantalla
  staticHeight,
  schema,
  onDeleteSuccess,
}: DataTableProps, ref) => {


  useImperativeHandle(ref, () => ({
    customColumns,
    table,
    columns,
    data,
    index,
    errorCells,
    schema,
    setEditingCell,
    setColumnFilters,
    setGlobalFilter,
  }));

  const { data,
    columns,
    setData,
    optionsColumn,
    index,
    setIndex,
    isLoading,
    primaryKey,
    initialize,
    columnVisibility,
    updateIdList,
    setUpdateIdList,
    setColumns,
    //   selected,
    rowSelection,
    setRowSelection,
    errorCells,
    // events
    onRefresh,
    onSelectRow,
    selectionMode,
    onSelectionModeChange,
    insertRow,
    removeErrorCells,
    setColumnVisibility,
    //      deleteRow,
    canDeleteRow,
    callSaveService,
    onSort,
  } = useDataTable;

  const { height: screenHeight } = useScreenSize();

  const columnResizeMode: ColumnResizeMode = 'onChange';
  const [sorting, setSorting] = useState<SortingState>([])

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const [editingCell, setEditingCell] = useState<{ rowIndex: number, columnId: string }>();

  const configDataTable = useBoolean();

  const [readOnly, setReadOnly] = useState(!editable);

  const [openFilters, setOpenFilters] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(showRowIndex);

  const tableRef = useRef(null);

  const confirm = useBoolean();
  const popover = usePopover();
  const [debug, setDebug] = useState(false);

  const handleEditCell = useCallback((rowIndex: number, columnId: string) => {
    setEditingCell({ rowIndex, columnId });
  }, []);



  const table = useReactTable({
    data,
    columns,
    defaultColumn: EditableCell,
    columnResizeMode,
    initialState: {
      pagination: {
        pageSize: rows,
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
      readOnly,
      optionsColumn,
      editingCell,
      handleEditCell,
      removeErrorCells,
      // Options para Dropdown
      eventsColumns,   // Para acceder desde  EditableCell
      updateData: (rowIndex: number, columnId: string, value: any) => {
        // Verifica que hayan cambios en la data

        // if (rowIndex !== index)
        // setIndex(rowIndex);

        // Skip page index reset until after next rerender
        skipAutoResetPageIndex()
        setData(old =>
          old.map((_row, _index) => {
            if (_index === rowIndex) {
              // si no es fila insertada
              if (!isDefined(_row.insert)) {
                // _row.update = _row[primaryKey];
                const pkRow: number = Number(_row[primaryKey]);
                if (!updateIdList.includes(pkRow)) {
                  const newList = updateIdList.concat(pkRow);
                  setUpdateIdList(newList);
                }
                const colsUpdate = _row?.colsUpdate || [];
                if (colsUpdate.indexOf(columnId) === -1)
                  colsUpdate.push(columnId);
                // console.log(colsUpdate);
                _row.colsUpdate = colsUpdate;
              }
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return _row
          })
        )

      },

      updateDataByRow: (rowIndex: number, newRow: any) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex()
        setData((old) =>
          old.map((_row, _index) => {
            if (_index === rowIndex) {
              return {
                // ...old[rowIndex]!,
                ...newRow
              };
            }
            return _row;
          })
        )
      },

    },
    // enableRowSelection: true, // enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFnImpl,
    autoResetPageIndex,
    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  const heightPagination = useMemo(() => showPagination ? 0 : 62, [showPagination]);
  const height = useMemo(() => isDefined(staticHeight) ? staticHeight : (screenHeight - (restHeight - heightPagination)), [staticHeight, screenHeight, heightPagination, restHeight]);

  // useEffect(() => {
  //      if (initialize === true) {
  //                setOrderBy(defaultOrderBy || primaryKey);
  //           table.setPageSize(rows);
  //                onSort(defaultOrderBy || primaryKey);
  //       }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [initialize]);

  const isErrorColumn = useCallback((row: any, columnId: string) => {
    if (readOnly === true) return false;
    return errorCells.some(cell => cell.rowIndex === Number(row[primaryKey]) && cell.columnId === columnId);
  }, [errorCells, primaryKey, readOnly]);


  const handleSort = useCallback((name: string) => {
    onSort(name);
  }, [onSort]);



  const handleExportExcel = useCallback(() => {
    exportDataTableToExcel(columns, data);
    popover.onClose();
  }, [columns, data, popover]);



  const onDeleteRow = useCallback(async () => {
    const isDelete = await callSaveService();
    if (isDelete === true) {
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    }
    confirm.onFalse();
  }, [callSaveService, confirm, onDeleteSuccess]);


  const handleOpenConfirmDelete = useCallback(async () => {
    if (await canDeleteRow() === true)
      confirm.onTrue();
  }, [canDeleteRow, confirm]);



  const handleInsert = () => {
    // Skip page index reset until after next rerender
    skipAutoResetPageIndex();
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter('');
    insertRow();
    const column = columns.find(col => col.visible && !col.disabled);
    if (column) {
      handleEditCell(data.length, column.name);
    }
  };


  const handleRefresh = useCallback(() => {
    // table.reset();
    skipAutoResetPageIndex()
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter('');
    setEditingCell(undefined);
    onRefresh();
    popover.onClose();
  }, [onRefresh, popover, skipAutoResetPageIndex]);

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

  const handleOpenConfig = useCallback(async () => {
    configDataTable.onTrue();
  }, [configDataTable]);

  const { pageSize, pageIndex } = table.getState().pagination

  return (
    <>
      <Box sx={{ position: 'relative', pb: showPagination ? 0 : 3 }}>

        {showToolbar === true && (
          <>
            <DataTableToolbar
              type='DataTableQuery'
              popover={popover}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showFilter={showFilter}
              showInsert={showInsert}
              showDelete={showDelete}
              showOptions={showOptions}
              openFilters={openFilters}
              initialize={initialize}
              rowSelection={rowSelection}
              setOpenFilters={setOpenFilters}
              setColumnFilters={setColumnFilters}
              showSearch={showSearch}
              onInsert={handleInsert}
              onDelete={handleOpenConfirmDelete}
            />
            <DataTablePopoverOptions
              popover={popover}
              showSelectionMode={showSelectionMode}
              selectionMode={selectionMode}
              showRowIndex={showRowIndex}
              debug={debug}
              setDebug={setDebug}
              setReadOnly={setReadOnly}
              setDisplayIndex={setDisplayIndex}
              onSelectionModeChange={onSelectionModeChange}
              onRefresh={handleRefresh}
              onExportExcel={handleExportExcel}
              onOpenConfig={handleOpenConfig}
            />
          </>
        )}

        <TableContainer sx={(theme) => ({
          maxHeight: `${height}px`,
          height: `${height}px`,
          border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        })}
        >
          {initialize === false || isLoading === true ? (
            <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} />
          ) : (

            <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize(), minWidth: '100%' }}>
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
              />
              <TableBody ref={tableRef}>
                {table.getRowModel().rows.map((row, _index) => (
                  <RowDataTable
                    onEditCell={handleEditCell}
                    key={row.id}
                    selectionMode={selectionMode}
                    showRowIndex={displayIndex}
                    row={row}
                    index={(_index + 1) + (pageIndex * pageSize)}
                    isErrorColumn={isErrorColumn}
                    onSelectRow={() => { setIndex(_index); onSelectRow(String(row.id)); }}
                  />
                ))}

                {table.getRowModel().rows.length === 0 && (
                  <DataTableEmpty height={height} />
                )}
              </TableBody>
            </Table>

          )}
        </TableContainer>
      </Box>
      {(showPagination === true) && (
        <TablePagination
          rowsPerPageOptions={[25, 50, 100, 200]}
          component="div"
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={pageSize}
          page={pageIndex}
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


      {/* <div>
        pagination table.getFilteredRowModel().rows.length > data.length
        <pre>{JSON.stringify(rowSelection, null, 2)}</pre>
      </div> */}

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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </Button>
        }
      />

    </ >
  );

});
export default DataTable;
