// @mui
import { Box} from '@mui/material';
import { DataTableToolbarProps } from './types';

// ----------------------------------------------------------------------

export default function DataTableToolbar({
    type = 'DataTableQuery',
}: DataTableToolbarProps) {
    return (
        <Box>
            {type}
        </Box>
    );
}
