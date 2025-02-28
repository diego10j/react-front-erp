
import type { Key } from 'react';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { MenuItem, MenuList } from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  onCloseMobile: () => void;
  conversation: any;
  onSelectContact: (contact: any) => void;
  onChangeEstadoChat: (id: string, estado: boolean) => void;
};

export function ChatNavItem({ selected, collapse, conversation, onCloseMobile, onSelectContact, onChangeEstadoChat }: Props) {

  const mdUp = useResponsive('up', 'md');

  const popover = usePopover();

  const { group = false, nombre_whcha: displayName, body_whmem: displayText, participants = [], fecha_msg_whcha: lastActivity, hasOnlineInGroup, status_whmem: status, direction_whmem: direction } =
    conversation;

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }
      onChangeEstadoChat(conversation.id_whmem, true);
      onSelectContact(conversation);
    } catch (error) {
      console.error(error);
    }
  }, [conversation, mdUp, onChangeEstadoChat, onCloseMobile, onSelectContact]);


  const handleRightClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault(); // Evita el menú contextual del navegador
    popover.onOpen(event);
  };

  const renderGroup = (
    <Badge
      variant={hasOnlineInGroup ? 'online' : 'invisible'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {participants.slice(0, 2).map((participant: { id: Key | null | undefined; name: string | undefined; avatarUrl: string | undefined; }) => (
          <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
        ))}
      </AvatarGroup>
    </Badge>
  );

  const renderSingle = (
    <Badge key={conversation.ide_whcha} variant="dot" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Avatar alt={conversation?.nombre_whcha} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        onContextMenu={handleRightClick}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.no_leidos_whcha : 0}
        >
          {group ? renderGroup : renderSingle}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={displayName}
              primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
              secondary={
                <Stack alignItems="flex-start" component="span" direction="row" spacing={0.5}
                  sx={{
                    alignItems: 'center', // Centra el ícono y el texto de la hora en la fila
                  }}>
                  {direction === '1' && (
                    <Iconify
                      icon={status === 'failed' ? 'material-symbols-light:error-outline-rounded' : status === 'read' ? 'solar:check-read-line-duotone' : 'solar:unread-line-duotone'}
                      sx={{ color: status === 'failed' ? 'error.main' : status === 'read' ? 'info.main' : 'action.disabled' }}
                      width={17} />
                  )}
                  <Typography component="span" variant={conversation.leido_whcha ? 'subtitle2' : 'body2'}
                    sx={{ color: conversation.leido_whcha === false ? 'text.primary' : 'text.secondary' }} noWrap>
                    {displayText}
                  </Typography>
                </Stack>
              }
            />

            <Stack alignItems="flex-end" sx={{ alignSelf: 'stretch' }}>
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
              >
                {fToNow(lastActivity)}
              </Typography>

              {conversation.leido_whcha === false && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'success.main',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Stack>
          </>
        )}
      </ListItemButton>


      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <MenuList>
          <MenuList>
            <MenuItem
              onClick={() => {
                popover.onClose();
              }}
            >
              <Iconify icon="solar:printer-minimalistic-bold" />
              Print
            </MenuItem>

            <MenuItem
              onClick={() => {
                popover.onClose();
              }}
            >
              <Iconify icon="solar:import-bold" />
              Import
            </MenuItem>

            <MenuItem
              onClick={() => {
                popover.onClose();
              }}
            >
              <Iconify icon="solar:export-bold" />
              Export
            </MenuItem>
          </MenuList>
        </MenuList>
      </CustomPopover>

    </Box>
  );
}
