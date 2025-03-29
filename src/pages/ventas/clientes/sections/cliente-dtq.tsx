import { useMemo, useState, useEffect, useCallback } from "react";

import { Link, Stack, Switch, Typography, FormControlLabel } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { useGetClientes } from "src/api/ventas/clientes";

import { paths } from '../../../../routes/paths';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------

export default function ClienteDTQ() {

  const [activos, setActivos] = useState(true);

  const config = useGetClientes();
  const tabClientes = useDataTableQuery({ config });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'nom_geper', label: 'Cliente', renderComponent: renderNombre, size: 450
    },
    {
      name: 'activo_geper', component: 'Active'
    },
    {
      name: 'identificac_geper', visible: false
    },
    {
      name: 'identificac_geper', visible: false
    },
    {
      name: 'nombre_getid', visible: false
    },

  ], []);


  // Filtra productos activos
  useEffect(() => {
    if (activos === true) {
      tabClientes.setColumnFilters([
        {
          id: "activo_geper",
          value: [true]
        }
      ]);
    } else {
      tabClientes.setColumnFilters(prevFilters => prevFilters.filter(filter => filter.id !== "activo_inarti"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activos]);




  const handleChangeActivos = useCallback(
    () => {
      setActivos(!activos);
    },
    [activos]
  );

  return (

    <DataTableQuery
      ref={tabClientes.daTabRef}
      useDataTableQuery={tabClientes}
      customColumns={customColumns}
      numSkeletonCols={3}
      showRowIndex
      actionToolbar={
        <FormControlLabel
          label="Solo Clientes Activos"
          control={<Switch checked={activos} onChange={handleChangeActivos} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      }
    />
  );
}

/**
 * Render Componente de la columna nombre_inarti.
 * @param value
 * @param row
 * @returns
 */
const renderNombre = (_value: any, row: any) =>
  <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
    <Link component={RouterLink}
      underline="hover"
      color="inherit"
      href={paths.dashboard.ventas.clientes.details(row.uuid)} sx={{ cursor: 'pointer' }}>
      {_value}
    </Link>
    <Stack
      spacing={1}
      direction="row" sx={{ p: 0 }}
      alignItems="center"
      justifyContent="flex-end" >
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
      {row.nombre_getid}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
      {row.identificac_geper}
      </Typography>

    </Stack>
  </Stack>;



