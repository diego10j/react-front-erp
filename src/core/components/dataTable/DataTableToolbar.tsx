// @mui
import {
    Box,
    Stack,
    Tooltip,
    Checkbox,
    Typography,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import Iconify from '../../../components/iconify';
import { DataTableToolbarProps } from './types';
// components


// ----------------------------------------------------------------------

export default function DataTableToolbar({
    type = 'DataTableQuery',
    onRefresh
}: DataTableToolbarProps) {

    const smUp = useResponsive('up', 'sm');

    const mdUp = useResponsive('up', 'md');

    return (
        <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            flexShrink={0}
            sx={{
                px: 2,
                height: 80,
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
        >
            <Stack direction="row" alignItems="center" flexGrow={1}>
                <IconButton>
                    <Iconify icon="eva:menu-fill" />
                </IconButton>
                <Tooltip title="Refresh">
                    <IconButton onClick={onRefresh}>
                        <Iconify icon="eva:refresh-fill" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Dense">
                    <IconButton >
                        <Iconify icon="eva:collapse-fill" />
                    </IconButton>
                </Tooltip>

            </Stack >
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <TextField
                    size="small"
                    placeholder="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 180 }}
                />
                <Tooltip title="More">
                    <IconButton>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Tooltip>
            </Box>

        </Stack >

    );
}
