import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { Iconify } from 'src/components/iconify';
import { CustomPopover, UsePopoverReturn } from 'src/components/custom-popover';
import { getUrlImagen } from 'src/api/sistema/files';

// ----------------------------------------------------------------------

export type SelectEmpresaProps = ButtonBaseProps & {
  popover: UsePopoverReturn;
  empresa: any;
  onChange: (newValue: any) => void;
  data?: {
    ide_empr: string;
    nom_empr: string;
    logo_empr: string;
  }[];
};

export function SelectEmpresa({ popover, empresa = {}, onChange, data = [], sx, ...other }: SelectEmpresaProps) {

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: 1,
          width : '100%',
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          alt={empresa?.nom_empr}
          src={getUrlImagen(empresa?.logo_empr)}
          sx={{ width: 64, height: 64, borderRadius: '50%' }}
        />

        <Box
          component="span"
          sx={{
            typography: 'subtitle1',
            display: 'inline-flex',
          }}
        >
          {empresa?.nom_empr}
        </Box>
        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <MenuList sx={{ width: 400 }}>
          {data.map((option) => (
            <MenuItem
              key={option.ide_empr}
              selected={option.ide_empr === empresa?.ide_empr}
              onClick={() => onChange(option)}
              sx={{ height: 48 }}
            >
              <Avatar alt={option.nom_empr} src={option.logo_empr} sx={{ width: 24, height: 24 }} />
              <Box>
                {option.nom_empr}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
