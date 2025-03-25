import type {
  Table,
  ColumnFiltersState
} from '@tanstack/react-table';

import {
  flexRender
} from '@tanstack/react-table'

import { styled } from '@mui/material/styles';
import { 
  Slide, 
  TableRow, 
  Checkbox, 
  TableCell, 
  TableHead, 
  TableSortLabel,
  Skeleton,
} from '@mui/material';

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
  loading?: boolean;
  skeletonColumns?: number; // Opcional: número de columnas para el skeleton
};

function DataHeaderSkeleton({ numColumns = 5 }: { numColumns: number }) {
  return (
    <TableHead>
      <TableRow>
        {Array.from({ length: numColumns }).map((_, i) => (
          <TableCell key={i}>
            <Skeleton 
              variant="text" 
              width="100%" 
              height={40} 
              animation="wave" 
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function DataTableHeader({ 
  table, 
  displayIndex, 
  selectionMode,  
  orderable,  
  showFilter, 
  onSort, 
  openFilters, 
  columnFilters, 
  setColumnFilters,
  loading = false,
  skeletonColumns = 5 
}: DataTableHeaderProps) {
  
  if (loading) {
    return <DataHeaderSkeleton numColumns={skeletonColumns} />;
  }

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
                  {(orderable === true && header.column.getCanSort()) ? (
                    <TableSortLabel
                      hideSortIcon
                      active={!!header.column.getIsSorted()}
                      direction={header.column.getIsSorted() === 'asc' ? 'asc' : 'desc'}
                      onClick={() => { onSort(header.column.columnDef.name) }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableSortLabel>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
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