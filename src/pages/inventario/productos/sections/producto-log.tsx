import type { IgetActividades } from 'src/types/productos';

import { useMemo } from 'react';

import { Card , CardHeader } from '@mui/material';

import { useGetActividades } from 'src/api/inventario/productos';
import { ActivityLog } from 'src/core/components/activity/activity-log';

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

  return (
    <Card>
        <CardHeader title='Eventos del Producto' subheader='Registros Log de eventos realizdos sobre el' />
      {dataResponse.rowCount > 0 ? (
        <ActivityLog activities={dataResponse.rows} />
      ) : (
        <EmptyContent
          filled
          title="No existen datos"
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      )}
    </Card>
  );


}


