import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type SettingsButtonProps = IconButtonProps;

export function CalendarButton({ sx, ...other }: SettingsButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(paths.dashboard.calendar);
    };

    return (
        <IconButton
            aria-label="whatsapp"
            onClick={handleClick}
            sx={{ p: 0, width: 40, height: 40, ...sx }}
            {...other}
        >

            <Iconify icon="fluent-emoji-flat:calendar" width={22} />

        </IconButton>
    );
}
// invisible={!settings.canReset}