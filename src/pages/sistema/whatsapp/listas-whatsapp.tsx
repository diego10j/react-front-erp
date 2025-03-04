import type { CustomColumn } from 'src/core/types';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { getNombreEmpresa } from 'src/api/sistema';
import { useTableQueryListas } from 'src/api/whatsapp';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable, useDataTable } from 'src/core/components/dataTable';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

// esquema de validaciones
export const TableSchema = zod.object({
  nombre_whlis: zod
    .string()
    .min(1, { message: 'Dirección es obligatoria!' })
});

export default function ListasWhatsAppPage() {

  const loadingSave = useBoolean();

  const dataTable = useDataTable({ config: useTableQueryListas() });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_whlis', visible: false,
    },
    {
      name: 'color_whlis', component: 'Color', label: 'Color'
    },
    {
      name: 'activo_whlis', label: 'Activo', defaultValue: true,
    }
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
        <title>Listas de WhatsApp</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Listas de WhatsApp"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Listas de WhatsApp' },
          ]}
          action={
            <LoadingButton
              onClick={handleSave}
              loading={loadingSave.value}
              disabled={!dataTable.isChangeDetected()}
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

          <DataTable
            ref={dataTable.daTabRef}
            useDataTable={dataTable}
            editable
            rows={25}
            showRowIndex
            schema={TableSchema}
            numSkeletonCols={11}
            customColumns={customColumns}
          />
        </Card>
      </DashboardContent>
    </>
  );
}
