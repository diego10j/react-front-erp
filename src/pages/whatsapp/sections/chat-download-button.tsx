import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { bgBlur, varAlpha } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

interface DownloadButtonProps extends ButtonBaseProps {
    id: string; // ID del archivo que se va a descargar
}

export function ChatDownloadButton({ sx, id, ...other }: DownloadButtonProps) {
    const theme = useTheme();


    // Función para manejar el clic y descargar el archivo
    const handleDownload = () => {
        const downloadUrl = `${CONFIG.serverUrl}/api/whatsapp/download/0/${id}`; // URL del servicio web
        window.open(downloadUrl, '_blank'); // Abre la URL en una nueva pestaña
    };

    return (
        <ButtonBase
            onClick={handleDownload} // Maneja el clic para descargar el archivo
            sx={{
                p: 0,
                top: 0,
                right: 0,
                width: 1,
                height: 1,
                zIndex: 9,
                opacity: 0,
                position: 'absolute',
                color: 'common.white',
                borderRadius: 'inherit',
                transition: theme.transitions.create(['opacity']),
                '&:hover': {
                    ...bgBlur({ color: varAlpha(theme.vars.palette.grey['900Channel'], 0.64) }),
                    opacity: 1,
                },
                ...sx,
            }}
            {...other}
        >
            <Iconify icon="eva:arrow-circle-down-fill" width={24} />
        </ButtonBase>
    );
}

