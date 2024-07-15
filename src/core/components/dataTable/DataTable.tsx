import type {
  RankingInfo
} from '@tanstack/match-sorter-utils';
import type {
  RowData,
  FilterFn,
  SortingState,
  ColumnResizeMode,
  ColumnFiltersState
} from '@tanstack/react-table';

import * as XLSX from 'xlsx';
import {
  rankItem
} from '@tanstack/match-sorter-utils'
import { useRef, useState, useEffect, useMemo, forwardRef, useCallback, useImperativeHandle } from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'

// @mui
import { styled } from '@mui/material/styles';
import { Box, Table, Slide, Button, TableRow, Checkbox, TableBody, TableCell, TableHead, TableContainer, TableSortLabel, TablePagination } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useScreenHeight } from 'src/hooks/use-responsive';

import { ConfirmDialog } from 'src/components/custom-dialog';

import RowDataTable from './RowDataTable';
import FilterColumn from './FilterColumn';
import EditableCell from './EditableCell';
import DataTableEmpty from './DataTableEmpty';
import ConfigDataTable from './ConfigDataTable';
import DataTableToolbar from './DataTableToolbar'
import DataTableSkeleton from './DataTableSkeleton';
import { isDefined } from '../../../utils/common-util';
import DataTablePaginationActions from './DataTablePaginationActions'

import type { DataTableProps } from './types';
import type { Column, Options, EventColumn } from '../../types';



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
  typeOrder = 'asc',
  //  defaultOrderBy,
  numSkeletonCols = 5,
  showToolbar = true,
  showRowIndex = false,
  showSelectionMode = true,
  showSearch = true,
  showFilter = true,
  showInsert = true,
  orderable = true,
  restHeight = 360,  // valor defecto para 1 tabla en la pantalla
  staticHeight,
}: DataTableProps, ref) => {


  useImperativeHandle(ref, () => ({
    customColumns,
    table,
    columns,
    data,
    index,
    errorCells,
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
    isDeleteRow,
    callSaveService,
  } = useDataTable;

  const screenHeight = useScreenHeight();

  const columnResizeMode: ColumnResizeMode = 'onChange';
  const [sorting, setSorting] = useState<SortingState>([])
  const [order, setOrder] = useState(typeOrder);
  const [orderBy, setOrderBy] = useState(''); // defaultOrderBy || ''
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


  const height = useMemo(() => {
    return isDefined(staticHeight) ? staticHeight : (screenHeight - restHeight);
  }, [staticHeight, screenHeight, restHeight]);

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
      fuzzy: fuzzyFilter,
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
    globalFilterFn: fuzzyFilter,
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


  const onSort = (name: string) => {
    const isAsc = orderBy === name && order === 'asc';
    if (name !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(name);
      setSorting([{ id: name, desc: isAsc }])
    }
  };


  const onExportExcel = () => {
    // Filtrar las columnas visibles que tienen un label definido
    const visibleColumns = columns.filter(col => col.visible && col.label);

    // Crear el encabezado usando el atributo 'label' de las columnas visibles
    const headers = visibleColumns.map(col => col.label);

    // Obtener los accessorKey para mapear los datos correctamente
    const accessorKeys = visibleColumns.map(col => col.accessorKey);

    // Preparar los datos para la hoja de cálculo
    const formattedData = data.map(row => {
      const newRow: { [key: string]: any } = {};
      accessorKeys.forEach((key, idx) => {
        newRow[headers[idx] || ''] = row[key];
      });
      return newRow;
    });

    // Crear la hoja de cálculo a partir de los datos
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Configurar el ancho de las columnas
    const columnWidths = visibleColumns.map(col => ({ wpx: col.size || 100 }));
    worksheet['!cols'] = columnWidths;

    // Crear el libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Exportar el libro de trabajo a un archivo
    XLSX.writeFile(workbook, 'DataSheet.xlsx');
  };

  const onDeleteRow = async () => {
    await callSaveService();
    confirm.onFalse();
  }


  const handleOpenConfirmDelete = async () => {
    if (await isDeleteRow() === true)
      confirm.onTrue();
  }


  const handleInsert = () => {
    // Skip page index reset until after next rerender
    skipAutoResetPageIndex();
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter('');
    return insertRow();
  };

  const handleRefresh = () => {
    // table.reset();
    skipAutoResetPageIndex()
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter('');
    setEditingCell(undefined);
    onRefresh();
  }

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

  const handleOpenConfig = () => {
    configDataTable.onTrue();
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
          showInsert={showInsert}
          openFilters={openFilters}
          initialize={initialize}
          setOpenFilters={setOpenFilters}
          setDisplayIndex={setDisplayIndex}
          setColumnFilters={setColumnFilters}
          setReadOnly={setReadOnly}
          showSearch={showSearch}
          showSelectionMode={showSelectionMode}
          onRefresh={handleRefresh}
          onExportExcel={onExportExcel}
          onSelectionModeChange={onSelectionModeChange}
          onInsert={handleInsert}
          onDelete={handleOpenConfirmDelete}
          onOpenConfig={handleOpenConfig} />
      )}

      <Box sx={{ position: 'relative' }}>
        <TableContainer sx={{ maxHeight: `${height}px`, height: `${height}px` }}>
          {initialize === false || isLoading === true ? (
            <DataTableSkeleton rows={rows} numColumns={numSkeletonCols} />
          ) : (

            <Table stickyHeader size='small' sx={{ width: table.getCenterTotalSize() }}>
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
                          textTransform: 'capitalize',
                          textAlign: 'center',
                          width: header.getSize(),
                          minWidth: header.getSize()
                        }}
                        sortDirection={orderBy === header.column.columnDef.name ? order : false}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {(orderable === true && header.column.getCanSort()) ? (
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
                  <RowDataTable
                    onEditCell={handleEditCell}
                    key={row.id}
                    selectionMode={selectionMode}
                    showRowIndex={displayIndex}
                    row={row}
                    index={_index}
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
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 200]}
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

      {/* <div>
        <pre>{JSON.stringify(rowSelection, null, 2)}</pre>
      </div> */}

      <ConfigDataTable columns={columns} onColumnsChange={handleColumnsChange} open={configDataTable.value} onClose={configDataTable.onFalse} />


      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content="Está seguro de que desea eliminar el registro seleccionado ?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />

    </ >
  );

});
export default DataTable;
