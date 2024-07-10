import { Helmet } from 'react-helmet-async';

import { Card, Button, } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';


import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useRef } from 'react';
import { useGetTreeModel } from 'src/api/core';
import useTree from '../../../core/components/tree/useTree';
import Tree from '../../../core/components/tree/Tree';



// ----------------------------------------------------------------------
const metadata = {
  header: 'Opciones',
  title: 'Listado de Opciones',
  parent: 'Administración',
  parentURL: paths.dashboard.sistema.root
};

export default function OpcionListPage() {

  const refTree = useRef();
  const configTree = useGetTreeModel({
    tableName: 'sis_opcion',
    primaryKey: 'ide_opci',
    columnName: 'nom_opci',
    columnNode: 'sis_ide_opci',
  });
  const treTree = useTree({ config: configTree, ref: refTree });


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
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Tree useTree={treTree} ref={refTree} />
        </Card>
      </DashboardContent >
    </>
  );
}
