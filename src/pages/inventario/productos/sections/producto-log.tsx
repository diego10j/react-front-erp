import type { BoxProps } from '@mui/material';
import type { IgetActividades } from 'src/types/inventario/productos';

import { useMemo } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Link, Card, Stack, Typography } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { useGetActividades } from 'src/api/inventario/productos';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';


// ----------------------------------------------------------------------

type Props = {
  currentProducto: any;
};
export default function ProductoLog({ currentProducto }: Props) {

  const paramActividades: IgetActividades = useMemo(() => (
    { ide_inarti: currentProducto.ide_inarti }
  ), [currentProducto.ide_inarti]);
  const { dataResponse } = useGetActividades(paramActividades);

  const theme = useTheme();

  const colors = [
    theme.vars.palette.info.main,
    theme.vars.palette.error.main,
    theme.vars.palette.secondary.main,
    theme.vars.palette.success.main,
  ];

  return (

    <Card sx={{ p: 3, mt: { xs: 3, lg: 0 } }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Actividades del Producto
      </Typography>

      {dataResponse.rowCount > 0 ? (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          {dataResponse.rows.map((item: any, index: number) => (
            <Item key={item.ide_acti} item={item} sx={{ color: colors[index] }} />
          ))}
        </Box>
      ) : (
        <EmptyContent
          title="No existen datos"
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      )}

    </Card>

  );
}

// ----------------------------------------------------------------------

type CourseItemProps = BoxProps & {
  item: any;
};

function Item({ item, sx, ...other }: CourseItemProps) {

  return (
    <Box sx={{ gap: 1.5, display: 'flex', ...sx }} {...other}>
      <Box
        sx={{
          width: 6,
          my: '3px',
          height: 16,
          flexShrink: 0,
          opacity: 0.24,
          borderRadius: 1,
          bgcolor: 'currentColor',
        }}
      />

      <Box
        sx={{
          gap: 1,
          minWidth: 0,
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
        }}
      >
        <Link variant="subtitle2" color="inherit" noWrap sx={{ color: 'text.primary' }}>
          {item.nom_acti}
        </Link>

        <Stack direction="column">
          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
              color: 'text.secondary',
            }}
          >
            <Iconify width={16} icon="solar:calendar-date-bold" />
            {fDateTime(item.fecha_creacion_acti)}
          </Box>

          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
              color: 'text.secondary',
            }}
          >
            <Iconify width={16} icon="lets-icons:user-cicrle-duotone" />
            {item.usuario_ingre}
          </Box>
        </Stack>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {item.historial_acti.map((history: any, i: number) => (
              <Box key={i} ml={2} mt={1}>
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                >
                  <strong>{history.campo_modificado}:</strong>{' '}
                  {typeof history.valor_anterior === 'object' ? JSON.stringify(history.valor_anterior) : history.valor_anterior} ➜
                  {typeof history.valor_nuevo === 'object' ? JSON.stringify(history.valor_nuevo) : history.valor_nuevo}
                </Typography>
              </Box>
            ))}
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}
