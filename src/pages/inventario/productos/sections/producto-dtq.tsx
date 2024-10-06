import { useMemo, useState, useEffect, useCallback } from "react";

import { Box, Link, Stack, Switch, Avatar, ListItemText, FormControlLabel } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { getUrlImagen } from 'src/api/sistema/files';
import { useGetProductos } from "src/api/inventario/productos";

import { paths } from '../../../../routes/paths';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------

export default function ProductosDTQ() {

  const [activos, setActivos] = useState(true);

  const config = useGetProductos();
  const tabProductos = useDataTableQuery({ config });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'nombre_inarti', label: 'Producto', renderComponent: renderNombre, size: 380
    },
    {
      name: 'activo_inarti', component: 'Active'
    },
    {
      name: 'codigo_inarti', visible: false
    },
    {
      name: 'foto_inarti', visible: false,
    },
    {
      name: 'nombre_incate', visible: false,
    },
    {
      name: 'siglas_inuni', visible: false,
    },
  ], []);


  // Filtra productos activos
  useEffect(() => {
    if (activos === true) {
      tabProductos.setColumnFilters([
        {
          "id": "activo_inarti",
          "value": true
        }
      ]);
    }
    else {
      tabProductos.setColumnFilters([]);
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
      ref={tabProductos.daTabRef}
      useDataTableQuery={tabProductos}
      customColumns={customColumns}
      rows={100}
      numSkeletonCols={7}
      heightSkeletonRow={60}
      showRowIndex
      actionToolbar={
        <FormControlLabel
          label="Solo Productos Activos"
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
  <Stack direction="row" alignItems="center" sx={{ py: 1 }}>
    <Avatar
      alt={row.nombre_inarti}
      src={getUrlImagen(row.foto_inarti)}
      variant="square"
      sx={{ width: 64, height: 64, mr: 2 }}
    />
    <ListItemText
      disableTypography
      primary={
        <Link
          component={RouterLink}
          noWrap
          color="inherit"
          variant="subtitle2"
          href={paths.dashboard.inventario.productos.details(row.uuid)} sx={{ cursor: 'pointer' }}
        >
          {row.nombre_inarti}
        </Link>
      }
      secondary={
        <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
          {row.nombre_incate}
        </Box>
      }
      sx={{ display: 'flex', flexDirection: 'column' }}
    />
  </Stack>;
