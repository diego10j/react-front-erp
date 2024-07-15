import type { ITreeModel } from 'src/types/core';

import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Card, Grid } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetTreeModel } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import OpcionesDAT from './sections/opcion-dat';
import Tree from '../../../core/components/tree/Tree';
import useTree from '../../../core/components/tree/useTree';
import { LoadingButton } from '@mui/lab';
import { Iconify } from '../../../components/iconify/iconify';



// ----------------------------------------------------------------------
const metadata = {
  header: 'Opciones',
  title: 'Listado de Opciones',
  parent: 'Administración',
  parentURL: paths.dashboard.sistema.root
};

export default function OpcionListPage() {


  const paramsTreeModel: ITreeModel = useMemo(() => (
    {
      tableName: 'sis_opcion',
      primaryKey: 'ide_opci',
      columnName: 'nom_opci',
      columnNode: 'sis_ide_opci',
    }
  ), []);

  const configTree = useGetTreeModel(paramsTreeModel);
  const treModel = useTree({ config: configTree, title: 'Opciones' });



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
          <Grid container spacing={3} >
            <Grid item xs={12} md={4}>

              <Tree useTree={treModel} restHeight={240} />

            </Grid>

            <Grid item xs={12} md={8}>
              <Box sx={{ pr: 3 }}>
                <OpcionesDAT selectedItem={treModel.selectedItem} />
              </Box>
            </Grid>
          </Grid>
        </Card>

      </DashboardContent >
    </>
  );
}
