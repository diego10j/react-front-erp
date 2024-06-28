import React, { useState } from 'react';

// @mui
import {
  Tooltip,
  Divider,
  MenuItem,
  CardHeader,
  IconButton,
} from '@mui/material';

import { CustomPopover, usePopover } from 'src/components/custom-popover';

// types
import { FormTableToolbarProps } from './types';
// components

import { Iconify } from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function FormTableToolbar({
  title, onRefresh, onExportExcel
}: FormTableToolbarProps) {


  const popover = usePopover();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
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
    <>
      <CardHeader
        action={
          <Tooltip title="Opciones">
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>

        }
        title={title || ''}
      />
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        slotProps={{
          paper: { sx: { p: 0, width: 200 } },
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

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleCustom}>
          <Iconify icon="eva:settings-fill" />
          Personalizar
        </MenuItem>
      </CustomPopover>
    </ >
  );
}
