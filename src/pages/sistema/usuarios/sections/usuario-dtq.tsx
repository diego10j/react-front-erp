import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";

import { Box, Link, Stack, Switch, Avatar, FormControlLabel } from '@mui/material';

import { RouterLink } from "src/routes/components";

import { paths } from '../../../../routes/paths';
import { useGetUsuarios } from '../../../../api/usuarios';
import { Label } from '../../../../components/label/label';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';
// ----------------------------------------------------------------------

export default function UsuariosDTQ() {


  const refTable = useRef();
  const configTable = useGetUsuarios();
  const tabQuery = useDataTableQuery({ config: configTable, ref: refTable });

  const [activos, setActivos] = useState(true);

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'ide_usua', visible: false
    },
    {
      name: 'activo_usua', renderComponent: renderActivo, align: 'center', label: 'Estado'
    },
    {
      name: 'bloqueado_usua', visible: false
    },
    {
      name: 'nom_usua', label: 'Nombre', renderComponent: renderNombre, size: 300
    },
    {
      name: 'nick_usua', label: 'Login', size: 100
    },
    {
      name: 'nom_perf', label: 'Perfil'
    },
    {
      name: 'avatar_usua', visible: false, size: 150
    },
    {
      name: 'mail_usua', visible: false,
    },
    {
      name: 'fecha_reg_usua', align: 'center', label: 'Fecha Creación'
    },
  ], []);


  // Filtra Usuarios activos
  useEffect(() => {
    if (activos === true) {
      tabQuery.setColumnFilters([
        {
          "id": "activo_usua",
          "value": true
        }
      ]);
    }
    else {
      tabQuery.setColumnFilters([]);
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
      ref={refTable}
      useDataTableQuery={tabQuery}
      customColumns={customColumns}
      rows={10}
      numSkeletonCols={7}
      heightSkeletonRow={60}
      showRowIndex
      actionToolbar={
        <FormControlLabel
          label="Solo Usuarios Activos"
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
 * Render Componente de la columna activo_usua.
 * @param value
 * @param row
 * @returns
 */
const renderActivo = (_value: any, row: any) =>
  <Label color={
    (row.activo_usua === true ? 'success' : 'error')
  }
  > {row.activo_usua === true ? 'Activo' : 'Inactivo'}
  </Label>

const renderNombre = (_value: any, row: any) =>
  <Stack spacing={2} direction="row" alignItems="center">
    <Avatar alt={row.nom_usua} src={row.nom_usua} />

    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
      <Link component={RouterLink}
        underline="hover"
        color="inherit"
        href={paths.dashboard.sistema.usuarios.edit(row.uuid)} sx={{ cursor: 'pointer' }}>
        {row.nom_usua}
      </Link>
      <Box component="span" sx={{ color: 'text.disabled' }}>
        {row.mail_usua}
      </Box>
    </Stack>
  </Stack>;



