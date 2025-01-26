import { useMemo } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { useGetDireccionesCliente, useGetContactosCliente } from 'src/api/ventas/clientes';

import ClienteDireccion from './sections/cliente-direccion';
import { ClienteContacto } from './sections/cliente-contacto';


// ----------------------------------------------------------------------
type Props = {
  currentCliente: any;
};

export default function ClienteDireccionContacto({ currentCliente }: Props) {

  const param = useMemo(() => (
    { ide_geper: Number(currentCliente?.ide_geper || 0) }
  ), [currentCliente]);
  const { dataResponse: dataResponseDir, isLoading } = useGetDireccionesCliente(param);

  const { dataResponse: dataResponseCont, isLoading: isLoadingCont } = useGetContactosCliente(param);


  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <ClienteDireccion direcciones={dataResponseDir} data={currentCliente} />
      </Grid>

      <Grid xs={12} md={4}>
        <ClienteContacto contactos={dataResponseCont} data={currentCliente} />
      </Grid>
    </Grid>
  );
}
