import type { IconButtonProps } from '@mui/material/IconButton';

import Badge from '@mui/material/Badge';

import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type SettingsButtonProps = IconButtonProps;

export function WhatsAppButton({ sx, ...other }: SettingsButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(paths.dashboard.whatsapp);
    };

    return (
        <IconButton
            aria-label="whatsapp"
            onClick={handleClick}
            sx={{ p: 0, width: 40, height: 40, ...sx }}
            {...other}
        >
            <Badge color="error" variant="dot" >
                <Iconify icon="logos:whatsapp-icon" width={25} />
            </Badge>
        </IconButton>
    );
}
// invisible={!settings.canReset}