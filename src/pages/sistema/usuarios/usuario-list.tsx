import { Helmet } from 'react-helmet-async';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

// @mui
import { Card, Switch, Button, Container, FormControlLabel } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

// types
import { CustomColumn } from 'src/core/types';
// api
import { useGetUsuarios } from 'src/api/usuarios';
import { DataTableQuery, useDataTableQuery } from 'src/core/components/dataTable';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Label from '../../../components/label/label';



// ----------------------------------------------------------------------

export default function UsuarioListPage() {

  const router = useRouter();
  const { themeStretch } = useSettingsContext();
  const [activos, setActivos] = useState(true);

  const refUsuarios = useRef();
  const config = useGetUsuarios();
  const tabUsuarios = useDataTableQuery({ config, ref: refUsuarios });

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
      name: 'fecha_reg_usua', align: 'center', label: 'Fecha'
    },
  ], []);


  // Filtra Usuarios activos
  useEffect(() => {
    if (activos === true) {
      tabUsuarios.setColumnFilters([
        {
          "id": "activo_usua",
          "value": true
        }
      ]);
    }
    else {
      tabUsuarios.setColumnFilters([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activos]);


  const handleEdit = useCallback(
    (row: any) => {
      router.push(paths.dashboard.sistema.usuarios.edit(row.uuid));
    },
    [router]
  );

  const onChangeActivos = () => {
    setActivos(!activos);
  };

  return (
    <>
      <Helmet>
        <title>Usuarios: Listado</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Lista de Usuarios"
          links={[
            {
              name: 'Usuarios',
              href: paths.dashboard.sistema.usuarios.root,
            },
            { name: 'Lista de Usuarios' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.sistema.usuarios.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo Usuario
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Scrollbar sx={{ pl: 2, pr: 2 }}>
            <DataTableQuery
              ref={refUsuarios}
              useDataTableQuery={tabUsuarios}
              customColumns={customColumns}
              rows={10}
              numSkeletonCols={7}
              heightSkeletonRow={60}
              height={680}
              showRowIndex
              actionToolbar={
                <FormControlLabel
                  label="Solo Usuarios Activos"
                  control={<Switch checked={activos} onChange={onChangeActivos} />}
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
          </Scrollbar>
        </Card>
      </Container >
    </>
  );
}

/**
 * Render Componente de la columna activo_usua.
 * @param value
 * @param row
 * @returns
 */
const renderActivo = (value: any, row: any) =>
  <Label color={
    (row.activo_usua === true ? 'success' : 'error')
  }
  > {row.activo_usua === true ? 'Activo' : 'Inactivo'}
  </Label>
