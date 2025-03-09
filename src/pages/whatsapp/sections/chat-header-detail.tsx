import type { IListChat } from 'src/types/whatsapp';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fPhoneNumber } from 'src/utils/phone-util';

import { UnReadMessageIcon } from 'src/core/components/icons/CommonIcons';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ChatListAdd } from './chat-list-add';
import { ChatHeaderSkeleton } from './chat-skeleton';

import type { UseNavCollapseReturn } from '../hooks/use-collapse-nav';



// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  contact: any;
  participants: any[];
  collapseNav: UseNavCollapseReturn;
  lists: IListChat[];
  onChangeUnReadChat: (leido: boolean) => void;
  onChangeFavoriteChat: (isFavorite: boolean) => void;
};

export function ChatHeaderDetail({ collapseNav, participants, contact, loading, lists, onChangeUnReadChat, onChangeFavoriteChat }: Props) {
  const popover = usePopover();

  const lgUp = useResponsive('up', 'lg');

  const group = false;

  const singleParticipant = contact;

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const addListChat = useBoolean();


  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);

  const handleOpenAddList = useCallback(async () => {
    addListChat.onTrue();
  }, [addListChat]);

  const handleSaveAddList = useCallback(async () => {
    console.log('Add');
  }, []);





  const renderGroup = (
    <AvatarGroup max={3} sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 32, height: 32 } }}>
      {participants.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Badge
        variant='dot'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar alt={contact?.nombre_whcha} />
      </Badge>

      <ListItemText
        primary={singleParticipant?.nombre_whcha}
        secondary={fPhoneNumber(singleParticipant?.wa_id_whmem)}
        secondaryTypographyProps={{
          component: 'span',
          textTransform: 'capitalize'
        }}
      />
    </Stack>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  return (
    <>
      {group ? renderGroup : renderSingle}

      <Stack direction="row" flexGrow={1} justifyContent="flex-end">


        <IconButton onClick={handleToggleNav}>
          <Iconify icon={collapseDesktop ? 'ri:sidebar-unfold-fill' : 'ri:sidebar-fold-fill'} />
        </IconButton>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem
            onClick={async () => {
              onChangeUnReadChat(false);
              popover.onClose();
            }}
          >
            <UnReadMessageIcon />
            Marcar como no leído
          </MenuItem>

          <MenuItem
            onClick={() => {
              const isFavorite = !(contact?.favorito_whcha === true);
              onChangeFavoriteChat(isFavorite);
              popover.onClose();
            }}
          >
            <Iconify icon={contact?.favorito_whcha === false ? "lucide:star" : "lucide:star-off"} />
            {contact?.favorito_whcha === true ? "Quitar de favoritos" : "Añadir a favoritos"}
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleOpenAddList();
              popover.onClose();
            }}
          >
            <Iconify icon="fluent:task-list-square-person-20-regular" />
            Agregar a Listas
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {

              popover.onClose();
            }}
          >
            <Iconify icon="fa-solid:user-edit" />
            Editar Contacto
          </MenuItem>


        </MenuList>
      </CustomPopover>

      <ChatListAdd
        open={addListChat.value}
        onClose={addListChat.onFalse}
        onSave={handleSaveAddList}
        lists={lists}
        selectedItems={[]} />

    </>
  );
}
