import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Card, Grid } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import OpcionesDAT from './sections/opcion-dat';
import Tree from '../../../core/components/tree/Tree';
import useTree from '../../../core/components/tree/useTree';
import { LoadingButton } from '@mui/lab';
import { Iconify } from '../../../components/iconify/iconify';
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { useListDataSistema, useTreeModelOpcion } from 'src/api/sistema/admin';
import { ITableQueryOpciones } from 'src/types/admin';



// ----------------------------------------------------------------------
const metadata = {
  header: 'Opciones',
  title: 'Listado de Opciones',
  parent: 'Administración',
  parentURL: paths.dashboard.sistema.root
};

export default function OpcionListPage() {

  const droSistema = useDropdown({ config: useListDataSistema(), defaultValue: '1' });

  const paramTreeModel: ITableQueryOpciones = useMemo(() => (
    {
      ide_sist: Number(droSistema.value),
    }
  ), [droSistema.value]);


  const configTree = useTreeModelOpcion(paramTreeModel);
  const treModel = useTree({ config: configTree, title: 'Opciones' });

  const paramOpciones: ITableQueryOpciones = useMemo(() => (
    {
      ide_sist: Number(droSistema.value),
      sis_ide_opci: treModel.selectedItem === null ? undefined : Number(treModel.selectedItem)
    }
  ), [droSistema.value, treModel.selectedItem]);


  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent} </title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={metadata.header}
          links={[
            {
              name: `${metadata.parent}`,
              href: `${metadata.parentURL}`,
            },
            { name: `${metadata.title}` },
          ]}
          action={
            <LoadingButton
              color="success"
              variant="contained"
              startIcon={<Iconify icon="ic:round-save-as" />}
            >
              Guardar
            </LoadingButton>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>

          <Box sx={{ p: 3 }}>
            <Dropdown
              label="Sistema"
              showEmptyOption={false}
              useDropdown={droSistema}
            />
          </Box>

          <Grid container spacing={3} >
            <Grid item xs={12} md={4}>
              <Box sx={{ pl: 3 }}>
                <Tree useTree={treModel} restHeight={300} />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ pr: 3 }}>
                <OpcionesDAT params={paramOpciones} />
              </Box>
            </Grid>
          </Grid>
        </Card>

      </DashboardContent >
    </>
  );
}
