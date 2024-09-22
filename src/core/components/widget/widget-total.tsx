import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';
import { svgColorClasses } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  icon: string;
  title: string;
  total: string;
  subtitle: string;
  isLoading?: boolean;
  color?: string;
};

export function WidgetTotal({ title, total, subtitle, icon, isLoading = false, color = 'primary', sx, ...other }: Props) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: `${color}.dark`,
        color: 'common.white',
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      {/* Sección de texto */}
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="subtitle1" color="inherit" >
          {title}
        </Typography>
        <Typography variant="h4" color="inherit">
          {total}
        </Typography>
        <Typography variant="body2" color="inherit" sx={{ opacity: 0.72 ,minHeight:22}}>
          {subtitle}
        </Typography>
      </Box>

      {/* Ícono de fondo */}
      <Iconify
        icon={icon}
        sx={{
          width: 96,
          height: 96,
          opacity: 0.25,
          position: 'absolute',
          right: 16,
          bottom: 16,
        }}
      />
    </Box>
  );
}
