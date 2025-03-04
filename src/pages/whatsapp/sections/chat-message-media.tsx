import Box from '@mui/material/Box';
import { Stack, Typography } from '@mui/material';

import { getMediaFile, useGetUrlArchivo } from 'src/api/whatsapp';

import { Iconify } from 'src/components/iconify';

import { ChatFileThumbnail } from './chat-thumbanail-file';

// ----------------------------------------------------------------------

type Props = {
  message: any;
  onOpenLightbox: (value: string) => void;
};

export function ChatMessageMedia({ message, onOpenLightbox }: Props) {
  const hasImage = message.content_type_whmem === 'image';

  const { dataResponse, isLoading } = useGetUrlArchivo({ id: message?.attachment_id_whmem || '000000000000' });

  if (!message?.attachment_id_whmem) {
    return null;
  }

  const { caption_whmem: caption, attachment_name_whmem: fileName, attachment_id_whmem: id } = message;

  if (isLoading) {
    return <Iconify icon="line-md:loading-twotone-loop" width={40}   sx={{ color: 'text.disabled' }}/>;
  }

  return (
    <>
      {isLoading === false && hasImage ? (
        <Box
          component="img"
          alt="attachment"
          src={getMediaFile(message.attachment_id_whmem)} // Usa la URL de la imagen obtenida de la API
          onClick={() => { onOpenLightbox(getMediaFile(message.attachment_id_whmem)); }} // Pasa la URL al lightbox
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            pb: 1,
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : (
        <Stack direction="column" spacing={1} sx={{ px: 1, pt: 1 }}>
          <ChatFileThumbnail
            tooltip
            id={id}
            slotProps={{ icon: { width: 48, height: 48 } }}
            sx={{ width: 48, height: 48, pl: 1 }}
            file={dataResponse.url}
            size={dataResponse.file_size}
            fileName={fileName} />
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
            {caption}
          </Typography>
        </Stack>
      )}
    </>
  );
}
