import type { Row} from '@tanstack/react-table';

import { flexRender } from '@tanstack/react-table';

import { alpha, styled } from '@mui/material/styles';
// @mui
import {
  Checkbox,
  TableRow,
  TableCell,
} from '@mui/material';

// @types
// components
// ----------------------------------------------------------------------

type Props = {
  selectionMode: string;
  showRowIndex: boolean;
  isErrorColumn?: (row: any, columnId: string) => any;
  row: Row<any>;
  index: number;
  onSelectRow: VoidFunction;
  onEditCell?: (rowIndex: number, columnId: string) => void;
};


const StyledTableCellRowIndex = styled(TableCell)(({ theme }) => ({
  fontSize: '0.780rem',
  backgroundColor: ` ${theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]} !important`,
  backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
  color: ` ${theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.grey[500]}`,
  borderBottom: `solid 1px ${theme.palette.divider} !important`,
  padding: '1px 10px',
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  borderBottom: `solid 1px ${theme.palette.divider}`,
  // borderRight: `solid 1px ${theme.palette.divider} !important`,
  padding: '1px 5px',
  // padding: 0,
  '&:hover': {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  },
  '&:focus': {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
  },
}));


export default function RowDataTable({
  selectionMode,
  showRowIndex,
  row,
  index,
  isErrorColumn,
  onSelectRow,
  onEditCell
}: Props) {



  const handleOnClick = () => {
    if (selectionMode === 'single') onSelectRow();
  };




  return (
    <TableRow hover selected={row.getIsSelected()} onClick={handleOnClick}>
      {showRowIndex && (
        <StyledTableCellRowIndex>
          {index + 1}
        </StyledTableCellRowIndex>
      )}
      {selectionMode === 'multiple' && (
        <StyledTableCellBody padding="checkbox">
          <Checkbox checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </StyledTableCellBody>
      )}
      {row.getVisibleCells().map((cell: any) => (
        <StyledTableCellBody key={cell.id}
          onClick={() => {
            if (onEditCell) {
              onEditCell(row.index, cell.column.columnDef.name)
            }
          }}

          sx={{
            textAlign: `${cell.column.columnDef.align} !important`,
            width: cell.column.getSize(),
            maxWidth: cell.column.getSize(),
            border: isErrorColumn && isErrorColumn(row.original, cell.column.id) ? '1px solid red' : 'none'
          }}
          align={cell.column.columnDef.align}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </StyledTableCellBody>
      ))}
    </TableRow>
  );
}
