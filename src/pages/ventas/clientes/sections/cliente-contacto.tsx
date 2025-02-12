import type { PaperProps } from '@mui/material';

import { useState, useCallback } from 'react';

import { Card, Paper, Stack, Avatar, Button, MenuList, MenuItem, CardHeader, IconButton, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ClienteContactoForm } from './cliente-contacto-frm';


// ----------------------------------------------------------------------

type Props = {
  data: any;
  contactos: any[];
};

export function ClienteContacto({ data, contactos }: Props) {

  const [contactId, setContactId] = useState('');

  const popover = usePopover();

  const addressForm = useBoolean();

  const handleAddNewAddress = useCallback((contact: any) => {
    console.info('CONTACT', contact);
  }, []);

  const handleSelectedId = useCallback(
    (event: React.MouseEvent<HTMLElement>, id: string) => {
      popover.onOpen(event);
      setContactId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setContactId('');
  }, [popover]);



  return (
    <>

      <Card>
        <CardHeader
          title="Contactos"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Contacto
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {contactos.map((follower) => (
            <FollowerItem
              key={follower.ide_gedirp}
              follower={follower}
              selected={contactos.includes(follower.ide_gedirp)}
              action={
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    handleSelectedId(event, `${follower.ide_gedirp}`);
                  }}
                  sx={{ position: 'absolute', top: 0, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              sx={{ p: 2, borderRadius: 1 }}
              />
          ))}
        </Stack>
      </Card>


      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={handleClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClose();
              console.info('EDIT', contactId);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              console.info('DELETE', contactId);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ClienteContactoForm
        ide_geper={data.ide_geper}
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleAddNewAddress}
      />

    </>
  );
}

// ----------------------------------------------------------------------
type FollowerItemProps = PaperProps & {
  action?: React.ReactNode;
  selected: boolean;
  follower: any;
};

function FollowerItem({ action, follower, selected, sx, ...other }: FollowerItemProps) {
  const { nombre_dir_gedirp, correo_gedirp } = follower;

  const avatarUrl = '/assets/core/avatar.webp'; // 10

  return (
    <Paper
      sx={{
        gap: 1,
        display: 'flex',
        position: 'relative',
        alignItems: { md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
      {...other}
    >
        <Avatar alt={nombre_dir_gedirp} src={avatarUrl} sx={{ width: 32, height: 32, mr: 1 }} />

        <ListItemText
          primary={nombre_dir_gedirp}
          secondary={
            <>
              <Iconify icon="ix:e-mail" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
              {correo_gedirp}
            </>
          }
          primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' ,pt:2}}
          secondaryTypographyProps={{
            mt: 0.5,
            noWrap: true,
            display: 'flex',
            component: 'span',
            alignItems: 'center',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

      {action && action}
    </Paper>
  );
}
