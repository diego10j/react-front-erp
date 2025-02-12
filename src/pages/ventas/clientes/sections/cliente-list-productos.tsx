
import type { BoxProps } from "@mui/material";
import type { IgetProductosCliente } from "src/types/ventas/clientes";

import { Box, Link, Stack, Avatar, Skeleton } from "@mui/material";

import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import { useGetProductosCliente } from "src/api/ventas/clientes";

import { Scrollbar } from "src/components/scrollbar";
import { EmptyContent } from "src/components/empty-content";

import { getUrlImagen } from '../../../../api/sistema/files';

// ----------------------------------------------------------------------

type Props = {
  params: IgetProductosCliente;
};

export default function ClienteListaProductos({ params }: Props) {

  const { dataResponse, isLoading } = useGetProductosCliente(params);

  return (

    <Scrollbar sx={{ maxHeight: 380, minHeight: 380 }}>
      <Box
        sx={{
          p: 3,
          gap: 3,
          minWidth: 360,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading === true ? (
          <Stack direction="column" spacing={1}>
            {Array.from({ length: 6 }).map((_value, i: number) => (
              <Box key={i} sx={{ flexGrow: 1 }} >
                <Skeleton variant="text" width="100%" height={64} />
              </Box>
            ))}
          </Stack>
        )
          : (
            <>
              {dataResponse.rowCount === 0 && (
                <EmptyContent title="No existen Productos" sx={{ py: 10, height: 'auto', flexGrow: 'unset' }} />
              )}

              {dataResponse.rows.map((item: any) => (
                <Item key={item.ide_inarti} item={item} />
              ))}
            </>
          )}


      </Box>
    </Scrollbar>

  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: any;
};

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Avatar
        alt={item.nombre_inarti}
        src={getUrlImagen(item.foto_inarti)}
        variant="square"
        sx={{ width: 32, height: 32, flexShrink: 0 }}
      />

      <Box
        sx={{ gap: 0.5, minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      >
        <Link noWrap sx={{ color: 'text.primary', typography: 'subtitle2' }}>
          {item.nombre_inarti}
        </Link>

        <Box sx={{ gap: 0.5, display: 'flex', typography: 'body2', color: 'text.secondary' }}>


          <Box component="span" sx={{ typography: 'caption' }} >
            {fDate(item.fecha_ultima_venta)}
          </Box>

        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          typography: 'body1',
        }}

      >
        <Stack direction="column">

          <Box
            component="span"
            sx={{
              ml: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            {item.ultima_cantidad}
            <Box
              component="span"
              sx={{
                typography: 'caption',
                ml: 0.5 // Espaciado entre los elementos
              }}
            >
              {item.siglas_inuni}
            </Box>
          </Box>

          <Box component="span" sx={{ ml: 'auto', typography: 'body2', color: 'text.secondary' }} >
            {fCurrency(item.ultimo_precio)}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
