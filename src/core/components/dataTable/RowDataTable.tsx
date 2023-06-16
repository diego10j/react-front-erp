import { styled, alpha } from '@mui/material/styles';
// @mui
import {
    Checkbox,
    TableRow,
    TableCell,
} from '@mui/material';
import { flexRender, Row } from '@tanstack/react-table';
// @types
// components
// ----------------------------------------------------------------------

type Props = {
    selectionMode: string;
    showRowIndex: boolean;
    row: Row<any>;
    index: number;
    onSelectRow: VoidFunction;
};


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: ` ${theme.palette.mode === 'light' ? alpha(theme.palette.grey[100], 0.5) : alpha(theme.palette.grey[900], 0.24)}`
    }
}));

const StyledTableCellRowIndex = styled(TableCell)(({ theme }) => ({
    fontSize: '0.780rem',
    backgroundColor: ` ${theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]} !important`,
    backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
    color: ` ${theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.grey[500]}`,
    borderBottom: `solid 1px ${theme.palette.divider} !important`,
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    borderBottom: `solid 1px ${theme.palette.divider} !important`,
    borderRight: `solid 1px ${theme.palette.divider}!important`,
      padding: '0px 5px',
    // padding: 0,
}));


export default function RowDataTable({
    selectionMode,
    showRowIndex,
    row,
    index,
    onSelectRow
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
                    sx={{
                        textAlign: `${cell.column.columnDef.align} !important`,
                        width: cell.column.getSize(),
                    }}
                    align={cell.column.columnDef.align}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </StyledTableCellBody>
            ))}
        </TableRow>
    );
}
