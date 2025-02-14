import EmojiPicker from 'emoji-picker-react';
import { useRef, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import { Menu, Popover, MenuItem, IconButton } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { enviarMensajeTexto } from 'src/api/whatsapp';

import { Iconify } from 'src/components/iconify';

type Props = {
  disabled: boolean;
  contact: any;
};

export function ChatMessageInput({
  disabled,
  contact,
}: Props) {

  const fileRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // For auto-growing input
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For emoji picker popover
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null); // For the attachment menu
  const [loading, setLoading] = useState(false);

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

  const handleAttachMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleAttachMenuClose = () => {
    setAnchorMenu(null);
  };

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  // Handle auto-growth of the input field
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';  // Reset the height before resizing
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;  // Resize to content
    }
  }, [message]);

  const handleSendMessage = useCallback(
    async () => {
      if (!message.trim()) return;
      setLoading(true);
      try {
        if (contact) {
          await enviarMensajeTexto({
            telefono: contact.wa_id_whmem,
            texto: message
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
        setLoading(false);
      }
    },
    [contact, message]
  );

  return (
    <>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ width: '100%', p: 1 }}>
        {/* Button to open attachment menu */}
        <IconButton onClick={handleAttachMenuOpen} sx={{ p: 1 }}>
          <Iconify icon="mingcute:add-line" width={24} />
        </IconButton>

        {/* Menu with attachment options */}
        <Menu
          anchorEl={anchorMenu}
          open={Boolean(anchorMenu)}
          onClose={handleAttachMenuClose}
        >
          <MenuItem onClick={handleAttach}>Documento</MenuItem>
          <MenuItem onClick={handleAttach}>Fotos y Videos</MenuItem>
          <MenuItem onClick={handleAttach}>Contacto</MenuItem>
          <MenuItem onClick={handleAttach}>Ubicación</MenuItem>
        </Menu>

        {/* Text input with emojis */}
        <InputBase
          inputRef={textAreaRef}
          value={message}
          onChange={handleChangeMessage}
          placeholder="Escribe un mensaje"
          disabled={disabled}
          multiline
          minRows={1}
          sx={{
            flexGrow: 1,
            px: 2,
            borderRadius: 2,
            border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
            height: 'auto', // Let it grow
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',  // Vertical center
          }}
          inputProps={{
            sx: {
              mt: 2,
            },
          }}
          startAdornment={
            <IconButton
              disabled={disabled}
              onClick={handleOpenEmojiPicker}>
              <Iconify icon="mdi:emoji-outline" />
            </IconButton>
          }
        />

        {/* Send button */}
        <IconButton
          onClick={handleSendMessage}
          color={message ? 'inherit' : 'default'}
          sx={{
            display: 'flex',
            justifyContent: 'center',  // Center the icon inside the button
            alignItems: 'center',
            padding: 1,  // Increased padding for larger button
          }}
          disabled={disabled || loading}
        >
          <Iconify icon="mdi:send-circle" width={40} />
        </IconButton>
      </Stack>

      {/* Emoji Picker */}
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
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>

      {/* Hidden file input for attachments */}
      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
