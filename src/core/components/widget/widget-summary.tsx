import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../../components/iconify/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  icon: string;
  title: string;
  total: string;
  color?: ColorType;
  isLoading?: boolean;
};

export function WidgetSummary({
  sx,
  icon,
  title,
  total,
  color = 'warning',
  isLoading = false,
  ...other
}: Props) {
  return (
    <Card sx={{ py: 3, pl: 3, pr: 2.5, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        {isLoading === true ? (
          <Skeleton variant="text" height={33} />
        ) : (
          <Box sx={{ typography: 'h3' }}>{total}</Box>
        )}

        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>

      <Iconify
        width={36}
        icon="carbon:close"
        sx={{
          top: 24,
          right: 20,
          width: 36,
          height: 36,
          position: 'absolute',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.vars.palette[color].main} 0%, ${theme.vars.palette[color].dark} 100%)`,
        }} />

      <Box
        sx={{
          top: -44,
          width: 160,
          zIndex: -1,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: (theme) =>
            `linear-gradient(to right, ${theme.vars.palette[color].main} 0%, ${varAlpha(theme.vars.palette[color].mainChannel, 0)} 100%)`,
        }}
      />
    </Card>
  );
}
