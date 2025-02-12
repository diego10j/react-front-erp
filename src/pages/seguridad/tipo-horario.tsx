import type { CustomColumn } from 'src/core/types';

import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';
import { SaveIcon } from 'src/core/components/icons/CommonIcons';
import { useTableQueryTiposHorario } from 'src/api/sistema/seguridad';
import { DataTable, useDataTable } from 'src/core/components/dataTable';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// ----------------------------------------------------------------------
const metadata = {
  header: 'Gestión Tipos de Horarios',
  title: 'Tipos de Horarios',
  parent: { name: 'Seguridad', href: paths.dashboard.seguridad.root },
};


export default function TipoHorarioPage() {

  const loadingSave = useBoolean();

  const configTable = useTableQueryTiposHorario();
  const dataTable = useDataTable({ config: configTable });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_tihor', visible: false
    },
    {
      name: 'activo_tihor', defaultValue: true, align: 'center', label: 'Activo'
    },
  ], []);


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
          heading={metadata.header}
          links={[
            metadata.parent,
            { name: `${metadata.title}` },
          ]}
          action={
            <LoadingButton
              onClick={handleSave}
              loading={loadingSave.value}
              disabled={!dataTable.isChangeDetected()}
              color="success"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Guardar
            </LoadingButton>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ p: { xs: 3, md: 5 } }}>
          <DataTable
            ref={dataTable.daTabRef}
            restHeight={450}
            useDataTable={dataTable}
            customColumns={customColumns}
            rows={25}
            numSkeletonCols={3}
            showRowIndex
          />

        </Card>

      </DashboardContent >

    </>
  );
}
