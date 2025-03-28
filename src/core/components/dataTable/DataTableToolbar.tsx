import { useState, useEffect } from 'react';

// @mui
import {
  Box,
  Zoom,
  Stack,
  Tooltip,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import type { DataTableToolbarProps } from './types';
// components

import { Iconify } from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function DataTableToolbar({
  popover,
  globalFilter,
  onGlobalFilterChange,
  showSearch,
  showFilter,
  showInsert,
  showDelete,
  showOptions,
  setOpenFilters,
  rowSelection,
  openFilters,
  initialize,
  setColumnFilters,
  onInsert,
  onDelete,
  children,
}: DataTableToolbarProps) {

  const mdUp = useResponsive('up', 'md');
  const [openSearch, setOpenSearch] = useState(mdUp);
  const [tempGlobalFilter, setTempGlobalFilter] = useState(globalFilter); 
  const [enableGlobalFilter, setEnableGlobalFilter] = useState(true); 

  useEffect(() => {
    if (mdUp)
      setOpenSearch(mdUp);
  }, [mdUp])

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleOpenFilters = () => {
    setOpenFilters(true);
  };

  const handleCloseSearch = () => {
    onGlobalFilterChange('');
    setTempGlobalFilter('');
    setOpenSearch(false);
    setEnableGlobalFilter(true);
  };

  const handleClearSearch = () => {
    onGlobalFilterChange('');
    setTempGlobalFilter('');
    setEnableGlobalFilter(true);
  };

  const handleCloseFilters = () => {
    setOpenFilters(false);
    setColumnFilters([]);
    setEnableGlobalFilter(true);
  };

  const handleSearch = () => {
    onGlobalFilterChange(tempGlobalFilter);
    setEnableGlobalFilter(false);
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{
        pl: 2,
        height: 60,
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        overflow: 'hidden', // Evitar que los elementos desborden
      }}
    >
      <Stack direction="row" alignItems="center" flexGrow={1}
        sx={{
          overflow: 'hidden',
          flexWrap: 'nowrap', // Evita que los elementos se envuelvan, si no quieres eso
        }}
      >
        {showInsert && (
          <Tooltip title="Insertar">
            <IconButton color="primary" onClick={onInsert}>
              <Iconify icon="mdi:table-large-add" />
            </IconButton>
          </Tooltip>
        )}
        {(showDelete && Object.keys(rowSelection).length > 0) ? (
          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={onDelete} disabled={Object.keys(rowSelection).length === 0}>
              <Iconify icon="tabler:trash-x-filled" />
            </IconButton>
          </Tooltip>
        ) : (
          (showDelete) && (
            <IconButton color="error" onClick={onDelete} disabled={Object.keys(rowSelection).length === 0}>
              <Iconify icon="tabler:trash-x-filled" />
            </IconButton>
          )
        )}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {children && children}
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {(showSearch && openSearch) && (
          <Zoom in={openSearch} >
            <TextField
              autoFocus
              disabled={!initialize || !enableGlobalFilter}
              value={tempGlobalFilter ?? ''}
              onChange={e => setTempGlobalFilter(String(e.target.value))}
              size="small"
              placeholder="Buscar..."
              InputProps={{
                endAdornment: globalFilter !== '' ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch}>
                      {mdUp && (
                        <Iconify icon="eva:close-outline" sx={{ color: 'text.disabled' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </IconButton>
                </InputAdornment>,
              }}
              sx={{
                width: { xs: 200, sm: 200, md: 300, lg: 300 }
              }}
            />
          </Zoom>


        )}
        {!mdUp && showSearch && (
          <IconButton aria-label="search" onClick={openSearch ? handleCloseSearch : handleOpenSearch}>
            {openSearch ? (
              <Iconify icon="ic:round-search-off" sx={{ color: 'inherit' }} />
            ) : (
              <Iconify icon="ic:round-search" sx={{ color: (theme) => `${theme.palette.grey[500]}` }} />
            )}
          </IconButton>
        )}
        {showFilter && (
          <IconButton aria-label="filters" onClick={openFilters ? handleCloseFilters : handleOpenFilters} color={!openFilters ? 'inherit' : 'error'}>
            {openFilters ? (
              <Iconify icon="lucide:filter-x" />
            ) : (
              <Iconify icon="lucide:filter" sx={{ color: 'text.disabled' }} />
            )}
          </IconButton>
        )}
        {showOptions && (
          <Tooltip title="Opciones">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        )}

      </Box>
    </Stack >

  );
}
