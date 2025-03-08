import { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import { Scrollbar } from 'src/components/scrollbar';

import { ChatRoomGroup } from './chat-room-group';
import { ChatRoomSkeleton } from './chat-skeleton';
import { ChatRoomSingle } from './chat-room-single';
import { ChatRoomAttachments } from './chat-room-attachments';

import type { UseNavCollapseReturn } from '../hooks/use-collapse-nav';


// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const NAV_DRAWER_WIDTH = 320;

type Props = {
  loading: boolean;
  participants: any[];
  collapseNav: UseNavCollapseReturn;
  messages: any;
};

export function ChatRoom({ collapseNav, participants, messages, loading }: Props) {
  const { collapseDesktop, openMobile, onCloseMobile } = collapseNav;

  const group = participants.length > 1;

  const attachments = useMemo(() =>
     messages
      .map((msg: any) => ({
        id: msg.attachment_id_whmem,
        type: msg.content_type_whmem,
        name: msg.attachment_name_whmem,
        size: msg.attachment_size_whmem,
        url: msg.attachment_url_whmem,
        createdAt: msg.fecha_whmem,
      }))
      .filter((attachment: any) => attachment.id) // Filtrar para asegurarse de que el attachment tenga un id
      .reverse() // Invertir el orden del arreglo
  , [messages]);

  const renderContent = loading ? (
    <ChatRoomSkeleton />
  ) : (
    <Scrollbar>
      <div>
        {group ? (
          <ChatRoomGroup participants={participants} />
        ) : (
          <ChatRoomSingle participant={participants[0]} />
        )}

        <ChatRoomAttachments attachments={attachments || []} />
      </div>
    </Scrollbar>
  );

  return (
    <>
      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', lg: 'flex' },
          borderLeft: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: 0 }),
        }}
      >
        {!collapseDesktop && renderContent}
      </Stack>

      <Drawer
        anchor="right"
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_DRAWER_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
