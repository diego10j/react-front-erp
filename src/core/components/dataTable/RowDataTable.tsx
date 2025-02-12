import type { Row } from '@tanstack/react-table';

import { flexRender } from '@tanstack/react-table';

import { styled } from '@mui/material/styles';
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
  backgroundColor: `${theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]} !important`,
  backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
  color: `${theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.grey[500]}`,
  padding: '1px 10px',
  textAlign: 'center',  // Centra el texto dentro de la celda
  width: 'auto',        // Ancho automático basado en el contenido
  whiteSpace: 'nowrap', // Evita que el texto se divida en múltiples líneas
  overflow: 'hidden',   // Oculta el desbordamiento si es necesario
}));


const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  borderBottom: `none`,
  // borderRight: `solid 1px ${theme.palette.divider} !important`,
  padding: '1px 5px',
  // padding: 0,
  // '&:hover': {
  //   border: `dashed 1px ${theme.palette.divider}`,
  // },
  // '&:focus': {
  //   border: `dashed 1px ${theme.palette.divider}`,
  // },
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
    <TableRow hover selected={row.getIsSelected()} aria-checked={row.getIsSelected()} onClick={handleOnClick}>
      {showRowIndex && (
        <StyledTableCellRowIndex>
          {index}
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
            border: isErrorColumn && isErrorColumn(row.original, cell.column.id) ? '1px dashed red !important' : 'none'
          }}
          align={cell.column.columnDef.align}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </StyledTableCellBody>
      ))}
    </TableRow>
  );
}
