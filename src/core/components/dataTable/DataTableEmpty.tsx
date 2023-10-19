// @mui
import { TableRow, TableCell } from '@mui/material';

import EmptyContent from '../../../components/empty-content';
//


// ----------------------------------------------------------------------

export default function DataTableEmpty() {
    return (
        <TableRow>
            <TableCell colSpan={12}>
                <EmptyContent
                    title="Sin Datos "
                    sx={{
                        '& span.MuiBox-root': { height: 150 },
                    }}
                />
            </TableCell>
        </TableRow>
    );
}
