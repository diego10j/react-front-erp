import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import type { IgetTrnPeriodo } from 'src/types/inventario/productos';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardHeader } from '@mui/material';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useGetTopClientes } from 'src/api/inventario/productos';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { fNumber } from '../../../../utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  params: IgetTrnPeriodo;
  title?: string;
  subheader?: string;

};

export function TopClientes({ params, title, subheader, ...other }: Props) {

  const { dataResponse, isLoading } = useGetTopClientes(params);

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            Ver todos
          </Button>
        }
      />
      {(isLoading === false) && (
        <Scrollbar sx={{ minHeight: 364 }}>
          <Box
            sx={{
              p: 2,
              gap: 3,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 360,
            }}
          >
            {dataResponse.rows.map((item: any) => (
              <Item key={item.ide_geper} item={item} />
            ))}
          </Box>
        </Scrollbar>
      )}

    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: any;
};

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box key={item.id} sx={{ gap: 2, m:0,display: 'flex', alignItems: 'center', ...sx }} {...other}>
      <Iconify icon="bi:person-fill" width={16} />

      <Typography variant="body2" noWrap>
        {item.nom_geper}
      </Typography>

      <Typography variant="body2" noWrap sx={{ ml: 'auto' }}>
        {`${fNumber(item.total_cantidad ? item.total_cantidad : 0)} ${item.siglas_inuni ? item.siglas_inuni : ''}`}
      </Typography>
    </Box>
  );
}
