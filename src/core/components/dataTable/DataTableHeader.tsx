
import type {
  Table,
  ColumnFiltersState
} from '@tanstack/react-table';

import {
  flexRender
} from '@tanstack/react-table'

import { styled } from '@mui/material/styles';
import { Slide, TableRow, Checkbox, TableCell, TableHead, TableSortLabel } from '@mui/material';

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

// ----------------------------------------------------------------------

type DataTableHeaderProps = {
  table: Table<any>;
  displayIndex: boolean;
  selectionMode: 'single' | 'multiple';
  orderable: boolean;
  showFilter: boolean;
  onSort: (name: string) => void;
  openFilters: boolean;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
};


export default function DataTableHeader({ table, displayIndex, selectionMode,  orderable,  showFilter, onSort, openFilters, columnFilters, setColumnFilters }: DataTableHeaderProps) {
  return (
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
              sortDirection={header.column.getIsSorted()}
            >
              {header.isPlaceholder ? null : (
                <>
                  {(orderable === true && header.column.getCanSort()) ? (<TableSortLabel
                    hideSortIcon
                    active={!!header.column.getIsSorted()}
                    direction={header.column.getIsSorted() === 'asc' ? 'asc' : 'desc'}
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
  );
}
