import dayjs from 'dayjs';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

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

  const slides = messages
    .filter((message) => message.content_type_whmem === 'image')
    .map((message) => ({ src: message.attachment_id_whmem }));

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
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
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
                  <Chip size="small"
                    variant="outlined"                    
                    label={dayjs(message.fecha_whmem).format('dddd, DD [de] MMMM YYYY')}
                  />

                </Typography>
              )}

              <ChatMessageItem
                contact={contact}
                message={message}
                onOpenLightbox={() => lightbox.onOpen(message.body_whmem)}
              />
            </div>
          );
        })}
      </Scrollbar>

      <Lightbox slides={slides} open={lightbox.open} close={lightbox.onClose} index={lightbox.selected} />
    </>
  );
}
