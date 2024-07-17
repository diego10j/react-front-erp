import React from 'react';

import { Helmet } from 'react-helmet-async';

import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { useTableQuerySistema } from 'src/api/sistema/admin';
import { usePage } from 'src/core/hooks/usePage';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable, useDataTable } from 'src/core/components/dataTable';

import { CustomBreadcrumbs } from '../../components/custom-breadcrumbs';
import { SaveIcon } from '../../core/components/icons/CommonIcons';


// ----------------------------------------------------------------------
const metadata = {
  header: 'Sistemas',
  title: 'Listado de Sistemas',
  parent: 'Administración',
  parentURL: paths.dashboard.sistema.root
};

export default function SistemaListPage() {


  const dataTable = useDataTable({ config: useTableQuerySistema() });

  const { saveAll, loadingSave } = usePage();

  const onSave = async () => {
    if (await dataTable.isValidSave())
      await saveAll(dataTable);
  };


  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent} </title>
      </Helmet>
      <DashboardContent>

        <CustomBreadcrumbs
          links={[
            {
              name: `${metadata.parent}`,
              href: `${metadata.parentURL}`,
            },
            { name: `${metadata.title}` },
          ]}
          action={
            <LoadingButton
              onClick={onSave}
              loading={loadingSave}
              disabled={!dataTable.isPendingChanges()}
              color="success"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Guardar
            </LoadingButton>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <DataTable
          ref={dataTable.daTabRef}
          useDataTable={dataTable}
          editable
          rows={50}
          showRowIndex
          numSkeletonCols={5}
        />

      </DashboardContent>
    </>


  );
}
