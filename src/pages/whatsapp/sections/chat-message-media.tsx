import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useGetUrlArchivo } from 'src/api/whatsapp';
import { ChatFileThumbnail } from './chat-thumbanail-file';

// ----------------------------------------------------------------------

type Props = {
    message: any;
    onOpenLightbox: (value: string) => void;
};

export function ChatMessageMedia({ message, onOpenLightbox }: Props) {
    const hasImage = message.content_type_whmem === 'image';

    if (!message.attachment_id_whmem) {
        return null;
    }

    const { dataResponse, isLoading } = useGetUrlArchivo({ id: message.attachment_id_whmem });

    const { caption_whmem: caption, attachment_name_whmem: fileName } = message;


    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            {hasImage ? (
                <Box
                    component="img"
                    alt="attachment"
                    src={dataResponse.url} // Usa la URL de la imagen obtenida de la API
                    onClick={() => onOpenLightbox(dataResponse.url)} // Pasa la URL al lightbox
                    sx={{
                        width: 400,
                        height: 'auto',
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        objectFit: 'cover',
                        aspectRatio: '16/11',
                        '&:hover': { opacity: 0.9 },
                    }}
                />
            ) : (
                <Stack direction="row" alignItems="center" spacing={2}>
                    <ChatFileThumbnail
                        tooltip
                        file={dataResponse.url}
                        fileName={fileName} />
                    <Typography
                        variant="inherit"
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        {caption}
                    </Typography>
                </Stack>


            )}
        </>
    );
}