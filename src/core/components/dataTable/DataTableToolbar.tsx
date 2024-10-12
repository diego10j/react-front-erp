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
  selectionMode,
  globalFilter,
  setGlobalFilter,
  showSelectionMode,
  showSearch,
  showFilter,
  showRowIndex,
  showInsert,
  showDelete,
  showOptions,
  setOpenFilters,
  setDisplayIndex,
  rowSelection,
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
  setDebug,
  debug
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
              disabled={!initialize}
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(String(e.target.value))}
              size="small"
              placeholder="Buscar..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: globalFilter !== '' ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch}>
                      {mdUp && (
                        <Iconify icon="eva:close-outline" sx={{ color: 'text.disabled' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : null,
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
          <IconButton aria-label="filters" onClick={openFilters ? handleCloseFilters : handleOpenFilters}>
            {openFilters ? (
              <Iconify icon="ic:round-filter-list-off" sx={{ color: 'inherit' }} />
            ) : (
              <Iconify icon="ic:round-filter-list" sx={{ color: (theme) => `${theme.palette.grey[500]}` }} />
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
        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{
            paper: { sx: { p: 0, width: 220 } },
            arrow: { placement: 'right-top', offset: 20 }
          }}
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
          <MenuItem>
            Debug
            <Switch
              checked={debug}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDebug(event.target.checked);
                popover.onClose();
              }
              }
            />
          </MenuItem>

          <MenuItem onClick={handleCustom}>
            <Iconify icon="eva:settings-fill" />
            Personalizar
          </MenuItem>
        </CustomPopover>
      </Box>
    </Stack >

  );
}
