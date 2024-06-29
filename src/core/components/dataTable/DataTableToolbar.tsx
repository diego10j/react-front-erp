import { useState, useEffect } from 'react';

// @mui
import {
  Box,
  Zoom,
  Stack,
  Switch,
  Tooltip,
  Divider,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { usePopover, CustomPopover } from 'src/components/custom-popover';

import type { DataTableToolbarProps } from './types';
// components

import { Iconify } from '../../../components/iconify';

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
  showInsert,
  setOpenFilters,
  setDisplayIndex,
  setReadOnly,
  openFilters,
  initialize,
  setColumnFilters,
  onRefresh,
  onExportExcel,
  onSelectionModeChange,
  onInsert,
  onDelete,
  onOpenConfig,
  children,
}: DataTableToolbarProps) {

  const mdUp = useResponsive('up', 'md');
  const [openSearch, setOpenSearch] = useState(mdUp);
  const popover = usePopover();

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
    setGlobalFilter('');
    setOpenSearch(false);
  };

  const handleClearSearch = () => {
    setGlobalFilter('');
  };

  const handleCloseFilters = () => {
    setOpenFilters(false);
    setColumnFilters([]);
  };

  const handleRefresh = () => {
    popover.onClose();
    onRefresh();
  };


  const handleExport = () => {
    popover.onClose();
    onExportExcel();
  };

  const handleCustom = () => {
    popover.onClose();
    onOpenConfig();
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
      <Stack direction="row" alignItems="center" flexGrow={1} >
        {showInsert && (
          <Tooltip title="Insertar">
            <IconButton color="primary" onClick={onInsert}>
              <Iconify icon="mdi:table-large-add" />
            </IconButton>
          </Tooltip>
        )}
        {showInsert && (
          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={onDelete}>
              <Iconify icon="tabler:trash-x-filled" />
            </IconButton>
          </Tooltip>
        )}
        {children && children}
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {(showSearch && openSearch) && (
          <Zoom in={openSearch} >
            <TextField
              autoFocus
              disabled={!initialize}
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(String(e.target.value))}
              size="small"
              placeholder="Buscar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearSearch}
                    >
                      {(globalFilter !== '' && mdUp) && (
                        <Iconify icon="eva:close-outline" sx={{ color: 'text.disabled' }} />
                      )}
                    </IconButton>

                  </InputAdornment>
                ),

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
              <Iconify icon="SearchOffIcon small" sx={{ color: 'inherit' }} />
            ) : (
              <Iconify icon="SearchIcon small" sx={{ color: (theme) => `${theme.palette.grey[500]}` }} />
            )}
          </IconButton>
        )}
        {showFilter && (
          <IconButton aria-label="filters" onClick={openFilters ? handleCloseFilters : handleOpenFilters}>
            {openFilters ? (
              <Iconify icon="FilterListOffIcon small" sx={{ color: 'inherit' }} />
            ) : (
              <Iconify icon="FilterListIcon small" sx={{ color: (theme) => `${theme.palette.grey[500]}` }} />
            )}
          </IconButton>
        )}

        <Tooltip title="Opciones">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Tooltip>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{ arrow: { placement: 'right-top' } }}
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
                  if (setReadOnly)
                    setReadOnly(event.target.checked);
                  popover.onClose();
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
                popover.onClose();
              }
              }
            />
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleCustom}>
            <Iconify icon="eva:settings-fill" />
            Personalizar
          </MenuItem>
        </CustomPopover>
      </Box>
    </Stack >

  );
}
