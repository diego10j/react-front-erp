/* eslint-disable unused-imports/no-unused-imports */

import type { PaperProps} from '@mui/material';

import { useState, useCallback } from 'react';

import { Box, Card, Stack, Paper, Button, MenuList, MenuItem, IconButton, CardHeader ,Typography} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ClienteDireccionForm } from './cliente-direccion-frm';


// ----------------------------------------------------------------------

type Props = {
  data: any;
  direcciones: any[];
};
export default function ClienteDireccion({ data, direcciones }: Props) {
  const [addressId, setAddressId] = useState('');

  const popover = usePopover();

  const addressForm = useBoolean();

  const handleAddNewAddress = useCallback((address: any) => {
    console.info('ADDRESS', address);
  }, []);

  const handleSelectedId = useCallback(
    (event: React.MouseEvent<HTMLElement>, id: string) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  return (
    <>
      <Card>
        <CardHeader
          title="Direcciones"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Dirección
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {direcciones.map((address) => (
            <AddressItem
              variant="outlined"
              key={address.ide_gedirp}
              address={address}
              action={
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    handleSelectedId(event, `${address.ide_gedirp}`);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              sx={{ p: 2.5, borderRadius: 1 }}
            />
          ))}
        </Stack>
      </Card>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={handleClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClose();
              console.info('SET AS PRIMARY', addressId);
            }}
          >
            <Iconify icon="eva:star-fill" />
            Establecer como principal
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              console.info('EDIT', addressId);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              console.info('DELETE', addressId);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ClienteDireccionForm
        ide_geper={data.ide_geper}
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleAddNewAddress}
      />
    </>
  );
}



type PropsI = PaperProps & {
  action?: React.ReactNode;
  address: any;
};

 function AddressItem({ address, action, sx, ...other }: PropsI) {
  return (
    <Paper
      sx={{
        gap: 2,
        display: 'flex',
        position: 'relative',
        alignItems: { md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {address.nombre_dir_gedirp}
            <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({address.nombre_getidi})
            </Box>
          </Typography>

          {address.defecto_gedirp && (
            <Label color="info" sx={{ ml: 1 }}>
              Principal
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.direccion_gedirp}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.telefono_gedirp}
        </Typography>
      </Stack>

      {action && action}
    </Paper>
  );
}
