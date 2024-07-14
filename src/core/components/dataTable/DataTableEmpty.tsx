// @mui
import { TableRow, TableCell } from '@mui/material';

import { EmptyContent } from '../../../components/empty-content';
//


// ----------------------------------------------------------------------
type Props = {
  restHeight?: number;
};


export default function DataTableEmpty({ restHeight = 200 }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={12} sx={{ height: `${restHeight - 40}px`}}>
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
