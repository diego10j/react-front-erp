import type { BoxProps } from '@mui/material/Box';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

type Props = BoxProps & {
  icon: string;
  title: string;
  total: any;
  color?: ColorType;
};

export function WidgetTotal({ title, total, icon, color = 'warning' }: Props) {

  return (
    <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'transparent', }}>
      <Box
        sx={{
          bgcolor: `${color}.lighter` ,

          borderRadius: 1,
          width: 50,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Iconify icon={icon} width={36} sx={{ color: `${color}.dark` }} />
      </Box>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: `${color}.main` }} >
          {total}
        </Typography>
      </Box>
    </Paper >
  );
}