import type { IChatParticipant } from 'src/types/chat';

import EmojiPicker from 'emoji-picker-react';
import { useRef, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { Popover } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { enviarMensajeTexto } from 'src/api/whatsapp';

import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  recipients: IChatParticipant[];
  contact: any;
  onAddRecipients: (recipients: IChatParticipant[]) => void;
};

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  contact,
}: Props) {

  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For emoji picker popover

  const handleEmojiClick = (emojiObject: { emoji: string; }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleOpenEmojiPicker = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEmojiPicker = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' || !message) return;

      try {
        if (contact) {
          // If the conversation already exists
          // await sendMessage(selectedConversationId, messageData);

          // Send message to your API
          try {
            await enviarMensajeTexto({
              telefono: contact.wa_id_whmem,
              texto: message
            });
          } catch (e) {
            console.error(e);
          }

        }
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
      }
    },
    [contact, message]
  );

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        startAdornment={
          <IconButton onClick={handleOpenEmojiPicker}>
            <Iconify icon="mdi:emoji-outline" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseEmojiPicker}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick}   />
        </Popover>
      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
