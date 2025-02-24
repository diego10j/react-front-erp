import dayjs from 'dayjs';
import { useMemo } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { getMediaFile } from 'src/api/whatsapp';
import { varAlpha,stylesMode } from 'src/theme/styles';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from '../hooks/use-messages-scroll';


// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  messages: any[];
  contact: any;
};

export function ChatMessageList({ contact, messages = [], loading }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);
  const theme = useTheme();
  const slides = useMemo(() =>
    messages
      .filter((message) => message.content_type_whmem === 'image')
      .map((message) => ({ src: getMediaFile(message.attachment_id_whmem) })),
    [messages]
  );

  const lightbox = useLightBox(slides);

  if (loading) {
    return (
      <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: 'absolute',
          }}
        />
      </Stack>
    );
  }

  let lastDate: string | null = null;

  return (
    <>
      <Scrollbar
        ref={messagesEndRef}
        sx={{
          bgcolor: 'background.neutral',
          px: 3,
          pt: 5,
          pb: 3,
          flex: '1 1 auto',
          backgroundImage: `linear-gradient(100deg, ${theme.vars.palette.background.neutral} 8%, ${varAlpha(theme.vars.palette.background.neutralChannel, 0.09)} 90%, ${theme.vars.palette.background.neutral} 100%), url('/assets/core/bg_whatsapp.png')`,
          [stylesMode.dark]: {
            backgroundImage: `linear-gradient(80deg, ${theme.vars.palette.background.default} 12%, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)} 90%, ${theme.vars.palette.background.default} 100%), url('/assets/core/bg_whatsapp.png')`,
          },

          backgroundRepeat: 'repeat',
          backgroundPosition: 'top right, left bottom',
          backgroundSize: '150%, 50%',
        }}
      >
        {messages.map((message) => {
          const messageDate = dayjs(message.fecha_whmem).format('DD/MM/YYYY');
          const showDateHeader = messageDate !== lastDate;
          lastDate = messageDate;

          return (
            <div key={message.uuid}>
              {showDateHeader && (
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    display: 'block',
                    my: 2,
                  }}
                >
                  <Chip
                    size="small"
                    variant="outlined"
                    label={dayjs(message.fecha_whmem).format('dddd, DD [de] MMMM YYYY')}
                  />
                </Typography>
              )}

              <ChatMessageItem
                contact={contact}
                message={message}
                onOpenLightbox={(value: string) => {
                  lightbox.onOpen(value);
                }}
              />
            </div>
          );
        })}
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
    </>
  );
}
