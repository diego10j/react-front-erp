import { useState } from 'react';
// @mui
import {
    Box,
    Stack,
    Tooltip,
    MenuItem,
    IconButton,
    InputAdornment,
    TextField,
    Divider,
    Zoom,
    Switch
} from '@mui/material';
// icons
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
// types
import { DataTableToolbarProps } from './types';


// components
import MenuPopover from '../../../components/menu-popover';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function DataTableToolbar({
    type = 'DataTableQuery',
    selectionMode,
    globalFilter,
    setGlobalFilter,
    showSelectionMode,
    showSearch,
    showFilter,
    showRowIndex,
    setOpenFilters,
    setDisplayIndex,
    openFilters,
    setColumnFilters,
    onRefresh,
    onExportExcel,
    onSelectionModeChange
}: DataTableToolbarProps) {

    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [openSearch, setOpenSearch] = useState(false);



    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget);
    };

    const handleOpenSearch = () => {
        setOpenSearch(true);
    };

    const handleOpenFilters = () => {
        setOpenFilters(true);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleCloseSearch = () => {
        setGlobalFilter('');
        setOpenSearch(false);
    };

    const handleCloseFilters = () => {
        setOpenFilters(false);
        setColumnFilters([]);
    };

    const handleRefresh = () => {
        handleClosePopover();
        onRefresh();
    };


    const handleExport = () => {
        handleClosePopover();
        onExportExcel();
    };

    const handleCustom = () => {
        handleClosePopover();
        console.log('CUSTOM');
    };


    return (
        <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            flexShrink={0}
            sx={{
                px: 2,
                height: 60,
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
        >
            <Stack direction="row" alignItems="center" flexGrow={1} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {openSearch && (
                    <Zoom in={openSearch} >
                        <TextField
                            autoFocus
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(String(e.target.value))}
                            size="small"
                            placeholder="Search"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ maxWidth: 200 }}
                        />
                    </Zoom>


                )}
                {showSearch && (
                    <IconButton aria-label="search" onClick={openSearch ? handleCloseSearch : handleOpenSearch}>
                        {openSearch ? (
                            <SearchOffIcon fontSize="small" sx={{ color: 'inherit' }} />
                        ) : (
                            <SearchIcon fontSize="small" sx={{ color: (theme) => `${theme.palette.grey[500]}` }} />
                        )}
                    </IconButton>
                )}
                {showFilter && (
                    <IconButton aria-label="filters" onClick={openFilters ? handleCloseFilters : handleOpenFilters}>
                        {openFilters ? (
                            <FilterListOffIcon fontSize="small" sx={{ color: 'inherit' }} />
                        ) : (
                            <FilterListIcon fontSize="small" sx={{ color: (theme) => `${theme.palette.grey[500]}` }} />
                        )}
                    </IconButton>
                )}

                <Tooltip title="More">
                    <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Tooltip>

                <MenuPopover
                    open={openPopover}
                    onClose={handleClosePopover}
                    arrow="right-top"
                    sx={{ width: 200 }}
                >

                    <MenuItem onClick={handleRefresh}>
                        <Iconify icon="eva:refresh-fill" />
                        Actualizar
                    </MenuItem>

                    <MenuItem onClick={handleExport}>
                        <Iconify icon="eva:download-fill" />
                        Exportar
                    </MenuItem>
                    {showSelectionMode && (
                        <MenuItem>
                            Selección Multiple
                            <Switch
                                checked={selectionMode === 'multiple'}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    onSelectionModeChange(event.target.checked ? 'multiple' : 'single');
                                    handleClosePopover();
                                }
                                }
                            />
                        </MenuItem>
                    )}

                    <MenuItem>
                        Ver Número de Fila
                        <Switch
                            checked={showRowIndex}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setDisplayIndex(event.target.checked);
                                handleClosePopover();
                            }
                            }
                        />
                    </MenuItem>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <MenuItem onClick={handleCustom}>
                        <Iconify icon="eva:settings-fill" />
                        Personalizar
                    </MenuItem>


                </MenuPopover>


            </Box>

        </Stack >

    );
}
