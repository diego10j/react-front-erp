


import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { Switch, FormControlLabel } from '@mui/material';

import { paths } from '../../../../routes/paths';
import { useRouter } from '../../../../routes/hooks';

import { useGetUsuarios } from '../../../../api/usuarios';

import { CustomColumn } from '../../../../core/types/customColumn';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import { Label } from '../../../../components/label/label';
// ----------------------------------------------------------------------

export default function UsuariosDTQ() {

  const router = useRouter();
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
      name: 'nom_usua', label: 'Nombre'
    },
    {
      name: 'nick_usua', label: 'Login', size: 100
    },
    {
      name: 'nom_perf', label: 'Perfil'
    },
    {
      name: 'avatar_usua', component: 'Image', order: 1, label: ''
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

  const handleEdit = useCallback(
    (row: any) => {
      router.push(paths.dashboard.sistema.usuarios.edit(row.uuid));
    },
    [router]
  );


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
      height={680}
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
      eventsColumns={[
        {
          name: 'nom_usua', onClick: handleEdit
        },
      ]}
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
