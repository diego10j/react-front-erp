import * as XLSX from 'xlsx';
import {
  rankItem,
  RankingInfo,
} from '@tanstack/match-sorter-utils'
import { useRef, useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';
import {
  RowData,
  FilterFn,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  ColumnResizeMode,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table'

// @mui
import { styled } from '@mui/material/styles';
import { Table, Paper, Slide, Button, TableRow, Checkbox, TableBody, TableCell, TableHead, TableContainer, TableSortLabel, TablePagination } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { DataTableProps } from './types';
import RowDataTable from './RowDataTable';
import FilterColumn from './FilterColumn';
import EditableCell from './EditableCell';
import DataTableEmpty from './DataTableEmpty';
import DataTableToolbar from './DataTableToolbar'
import { Options, EventColumn } from '../../types';
import DataTableSkeleton from './DataTableSkeleton';
import { isDefined } from '../../../utils/common-util';
import DataTablePaginationActions from './DataTablePaginationActions'



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
  rows = 25,
  customColumns,
  eventsColumns = [],
  height = 378,
  typeOrder = 'asc',
  //  defaultOrderBy,
  numSkeletonCols = 5,
  showToolbar = true,
  showRowIndex = false,
  showSelectionMode = true,
  showSearch = true,
  showFilter = true,
  showInsert = true,
  orderable = true
}: DataTableProps, ref) => {


  useImperativeHandle(ref, () => ({
    customColumns,
    table,
    columns,
    data,
    index
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
    //   selected,
    rowSelection,
    setRowSelection,
    // events
    onRefresh,
    onSelectRow,
    selectionMode,
    onSelectionModeChange,
    insertRow,
    //      deleteRow,
    isDeleteRow,
    callSaveService,
  } = useDataTable;

  const columnResizeMode: ColumnResizeMode = 'onChange';
  const [sorting, setSorting] = useState<SortingState>([])
  const [order, setOrder] = useState(typeOrder);
  const [orderBy, setOrderBy] = useState(''); // defaultOrderBy || ''
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [editingCell, setEditingCell] = useState<{ rowIndex: number, columnId: string }>();

  const [readOnly, setReadOnly] = useState(!editable);

  const [openFilters, setOpenFilters] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(showRowIndex);

  const tableRef = useRef(null);

  const confirm = useBoolean();

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
    // table.reset(); ***probar
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter('');
    onRefresh();
  }

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
          onDelete={handleOpenConfirmDelete} />
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }} square>
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
                    onSelectRow={() => { setIndex(_index); onSelectRow(String(row.id)); }}
                  />
                ))}

                {table.getRowModel().rows.length === 0 && (
                  <DataTableEmpty />
                )}
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
      <div>
        <pre>{JSON.stringify(rowSelection, null, 2)}</pre>
      </div>

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
