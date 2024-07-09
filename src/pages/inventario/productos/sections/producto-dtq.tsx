import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import { Box, Link, Stack, Switch, Avatar, ListItemText, FormControlLabel,Typography } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { useGetProductos } from "src/api/productos";

import { paths } from '../../../../routes/paths';
import { getUrlImagen } from '../../../../api/upload';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------

export default function ProductosDTQ() {



  const [activos, setActivos] = useState(true);

  const refProductos = useRef();
  const config = useGetProductos();
  const tabProductos = useDataTableQuery({ config, ref: refProductos });




  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'nombre_inarti', label: 'Producto', renderComponent: renderNombre, size: 380
    },
    {
      name: 'activo_inarti', visible: false
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
      name: 'nombre_inuni', visible: false,
    },
    {
      name: 'existencia', label: 'Existencia', renderComponent: renderExistencia, size: 200
    },
    {
      name: 'fecha_compra', align: 'center', label: 'Fecha Ult. Compra'
    },
    {
      name: 'precio_compra', label: 'Precio Ult. Compra', component: 'Money',
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
      ref={refProductos}
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
  <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
    <Avatar
      alt={row.nombre_inarti}
      src={getUrlImagen(row.foto_inarti)}
      variant="rounded"
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
          href={paths.dashboard.inventario.productos.edit(row.uuid)} sx={{ cursor: 'pointer' }}
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

const renderExistencia = (_value: any, row: any) =>
  <Typography variant="subtitle2" sx={{ mb: 1 }}>
    {row.existencia} {row.nombre_inuni}
  </Typography>
