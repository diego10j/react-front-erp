import EmojiPicker from 'emoji-picker-react';
import { useRef, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import { Popover, MenuItem, MenuList, IconButton } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { enviarMensajeMedia, enviarMensajeTexto } from 'src/api/whatsapp';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ChatUpload } from './chat-upload';

type Props = {
  disabled: boolean;
  contact: any;
};

export function ChatMessageInput({
  disabled,
  contact,
}: Props) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null); // For auto-growing input
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For emoji picker popover

  const [files, setFiles] = useState<(File)[]>([]);

  const [loading, setLoading] = useState(false);

  const popover = usePopover();

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



  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Máximo 5 documentos
      if (acceptedFiles && acceptedFiles.length > 5) {
        // Reduce el array a los 5 primeros
        acceptedFiles = acceptedFiles.slice(0, 5);
        toast.warning('Solo puedes subir un máximo de 5 archivos. Se han seleccionado los primeros 5.');
      }
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );



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


      setLoading(true);

      if (contact) {
        try {
          if (files && files.length > 0) {
            // Envía mensajes con archivos adjuntos
            await Promise.all(
              files.map(async (file, index) => {
                // Si es la primera iteración, envía el mensaje de texto junto con el archivo
                if (index === 0) {
                  await enviarMensajeMedia(file, contact.wa_id_whmem, message);
                }
                else {
                  // Envía el archivo como medio
                  await enviarMensajeMedia(file, contact.wa_id_whmem);
                }
              })
            );
          } else {
            if (!message.trim()) {
              toast.warning('El mensaje no puede estar vacío.');
              return;
            }
            // Envía solo el mensaje de texto
            await enviarMensajeTexto({
              telefono: contact.wa_id_whmem,
              texto: message,
            });
          }

          // Limpia el estado después de enviar el mensaje
          setFiles([]);
          setMessage('');
        } catch (error) {
          console.error('Error al enviar el mensaje:', error);
          toast.error(`Error al enviar el mensaje: ${error.message}`);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error('No se ha seleccionado un contacto.');
        setLoading(false);
      }
    },
    [contact, message, files]
  );



  return (
    <>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ width: '100%', p: 1 }}>
        {/* Button to open attachment menu */}



        <IconButton onClick={popover.onOpen} sx={{ p: 1 }}>
          <Iconify icon="mingcute:add-line" width={24} />
        </IconButton>

        <ChatUpload onDrop={handleDrop} />

        {/* Menu with attachment options */}

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{
            paper: { sx: { p: 0 } },
            arrow: { placement: 'top-left' },
          }}
        >
          <MenuList sx={{ my: 0.5, px: 0.5 }}>
            <MenuItem>
              <Iconify icon="solar:user-id-bold" width={24} />
              Contacto
            </MenuItem>
            <MenuItem>
              <Iconify icon="eva:settings-2-fill" width={24} />
              Respuestas rápidas
            </MenuItem>
          </MenuList>
        </CustomPopover>



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
    </>
  );
}
