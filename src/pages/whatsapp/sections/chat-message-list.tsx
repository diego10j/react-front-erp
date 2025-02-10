
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { ChatMessageItem } from './chat-message-item';
import { useMessagesScroll } from '../hooks/use-messages-scroll';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  messages: any[];
  contact: any;
  participants: any[];
};

export function ChatMessageList({ contact,messages = [], participants=[], loading }: Props) {
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

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
        {messages.map((message) => (
          <ChatMessageItem
            key={message.uuid}
            contact={contact}
            message={message}
            participants={participants}
            onOpenLightbox={() => lightbox.onOpen(message.body_whmem)}
          />
        ))}
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
