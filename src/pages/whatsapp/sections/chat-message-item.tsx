
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { ChatMessageMedia } from './chat-message-media';

// ----------------------------------------------------------------------

type Props = {
  contact: any;
  message: any;
  onOpenLightbox: (value: string) => void;
  onChangeUrlMediaFile: (id: string, url: string, size: number) => void;
};

export function ChatMessageItem({ contact, message, onOpenLightbox,onChangeUrlMediaFile }: Props) {

  const { nombre_whcha: firstName } = contact;

  const me = message.direction_whmem === "1";
  const hasMedia = message.content_type_whmem !== "text";

  const { body_whmem: body, fecha_whmem: createdAt, status_whmem: status, direction_whmem: direction } = message;

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        pb: 2,
        minWidth: 80,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.paper',
        ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        ...(hasMedia && { p: 0 }),
        position: 'relative', // Importante para posicionar el ícono en la esquina inferior derecha
      }}
    >
      {hasMedia === true ? (
        <ChatMessageMedia
          message={message}
          onOpenLightbox={onOpenLightbox}
          onChangeUrlMediaFile={onChangeUrlMediaFile}
        />
      ) : (

        <Typography
          variant='body2'
          sx={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-line',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {body}
        </Typography>
      )}
      {/* Ícono y hora en la parte inferior derecha */}
      <Stack
        component="span"
        direction="row"
        spacing={0.2}
        sx={{
          position: 'absolute', // Posiciona el stack en la parte inferior derecha
          bottom: 2, // Ajusta el espacio desde la parte inferior
          right: 4, // Ajusta el espacio desde el borde derecho
          alignItems: 'center', // Centra el ícono y el texto de la hora en la fila
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10 }}>{fTime(createdAt)}</Typography>
        {direction === '1' && (
          <Iconify
            icon={status === 'failed' ? 'material-symbols-light:error-outline-rounded' : status === 'read' ? 'solar:check-read-line-duotone' : 'solar:unread-line-duotone'}
            sx={{ color: status === 'failed' ? 'error.main' : status === 'read' ? 'info.main' : 'action.disabled' }}
            width={18} />
        )}

      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], { duration: theme.transitions.duration.shorter }),
        ...(me && { right: 0, left: 'unset' }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 5 }}>
      {!me && <Avatar alt={firstName} src={firstName} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ position: 'relative', '&:hover': { '& .message-actions': { opacity: 1 } } }}
        >
          {renderBody}
          {renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}
