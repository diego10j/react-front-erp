// @mui
import { TableRow, TableCell } from '@mui/material';

import { EmptyContent } from '../../../components/empty-content';
//


// ----------------------------------------------------------------------
type Props = {
  height?: number;
};


export default function DataTableEmpty({ height = 200 }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={12} sx={{ height: `${height - 40}px` }}>
        <EmptyContent
          title="Sin Datos"
          sx={{
            '& span.MuiBox-root': {
              height: `100%`
            },
          }}
        />
      </TableCell>
    </TableRow>
  );
}
