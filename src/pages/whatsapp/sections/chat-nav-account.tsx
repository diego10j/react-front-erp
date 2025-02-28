import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { useGetProfile } from 'src/api/whatsapp';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

type Props = {
  hasSocketConnection: boolean;
};

export function ChatNavAccount({ hasSocketConnection }: Props) {


  const { dataResponse, isLoading } = useGetProfile();

  const popover = usePopover();


  return (
    <>
      <Badge variant={hasSocketConnection === true ? 'online' : 'busy'} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {isLoading === false &&
          <Avatar
            alt={dataResponse?.nombre}
            onClick={popover.onOpen}
            sx={{ cursor: 'pointer', width: 48, height: 48 }}
          >
            {dataResponse?.nombre.charAt(0).toUpperCase()}
          </Avatar>
        }
      </Badge>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          paper: { sx: { p: 0 } },
          arrow: { placement: 'top-left' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2, pr: 1, pl: 2 }}>
          <ListItemText
            primary={dataResponse?.nombre}
            secondary={dataResponse?.telefono}
            secondaryTypographyProps={{ component: 'span' }}
          />
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList sx={{ my: 0.5, px: 0.5 }}>
          <MenuItem>
            <Badge
              variant={hasSocketConnection === true ? 'online' : 'busy'}
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  m: 0.75,
                  width: 12,
                  height: 12,
                  flexShrink: 0,
                  position: 'static',
                },
              }}
            />
            {hasSocketConnection === true ? 'En línea' : 'Fuera de línea'}

          </MenuItem>

          <MenuItem>
            <Iconify icon="solar:user-id-bold" width={24} />
            Profile
          </MenuItem>

          <MenuItem>
            <Iconify icon="eva:settings-2-fill" width={24} />
            Settings
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
