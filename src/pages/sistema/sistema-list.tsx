import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTableQuerySistema } from 'src/api/sistema/admin';
import { DataTable, useDataTable } from 'src/core/components/dataTable';

import { toast } from 'src/components/snackbar';

import { SaveIcon } from '../../core/components/icons/CommonIcons';
import { CustomBreadcrumbs } from '../../components/custom-breadcrumbs';


// ----------------------------------------------------------------------
const metadata = {
  header: 'Sistemas',
  title: 'Listado de Sistemas',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
};

export default function SistemaListPage() {

  const loadingSave = useBoolean();

  const dataTable = useDataTable({ config: useTableQuerySistema() });

  const handleSave = async () => {
    loadingSave.onTrue();
    try {
      if (await dataTable.isValidSave()) {
        const listQuery = dataTable.saveDataTable();
        await save({ listQuery });
        dataTable.commitChanges();
        toast.success(`Se guardó exitosamente`);
      }
    } catch (error) {
      toast.error(`Error al guardar ${error}`);
    }
    loadingSave.onFalse();
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent>

        <CustomBreadcrumbs
          links={[
            metadata.parent,
            { name: `${metadata.title}` },
          ]}
          action={
            <LoadingButton
              onClick={handleSave}
              loading={loadingSave.value}
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
        <Card>
          <DataTable
            ref={dataTable.daTabRef}
            useDataTable={dataTable}
            editable
            rows={50}
            showRowIndex
            numSkeletonCols={5}
          />
        </Card>
      </DashboardContent>
    </>


  );
}
