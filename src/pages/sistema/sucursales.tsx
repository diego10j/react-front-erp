import { z as zod } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useMemo, useCallback } from 'react';

import { Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { getNombreEmpresa } from 'src/api/sistema';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTableQuerySucursales } from 'src/api/sistema/empresa';
import { DataTable, useDataTable } from 'src/core/components/dataTable';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

// esquema de validaciones
export const TableSchema = zod.object({
  correo_sucu: zod
    .string()
    .min(1, { message: 'El correo electrónico es obligatorio!' })
    .email({ message: 'El formato del correo electrónico no es válido!' }),
  direccion_sucu: zod
    .string()
    .min(1, { message: 'La dirección es obligatoria!' })
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres!' })
});

export default function SucursalesPage() {

  const loadingSave = useBoolean();

  const dataTable = useDataTable({ config: useTableQuerySucursales() });


  const customColumns = useMemo(() => [
    {
      name: 'ide_sucu', visible: true, disabled: true
    },
    {
      name: 'nom_sucu', label: 'Nombre', required: true, unique: true
    },
  ], []);


  const onChangeEmpresa = useCallback((): void => {
    console.log(dataTable.index);
    console.log(dataTable.columns);
    dataTable.setValue(dataTable.index, 'Telefonos_sucu', 'xxxxx2');
    console.log(dataTable.getValue(dataTable.index, 'Telefonos_sucu'));
  }, [dataTable]);



  const handleSave = useCallback(async () => {
    loadingSave.onTrue();
    try {
      if (await dataTable.isValidSave()) {
        const listQuery = dataTable.saveDataTable();
        await save({ listQuery });
        dataTable.commitChanges();

        toast.success(`Se guardó exitosamente`);
      }
    } catch (error) {
      toast.error(`Error al guardar ${error} ${error.message}`);
    }
    loadingSave.onFalse();
  }, [dataTable, loadingSave]);


  return (
    <>
      <Helmet>
        <title>Sucursales</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Sucursales"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: getNombreEmpresa() },
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
            showRowIndex
            schema={TableSchema}
            numSkeletonCols={11}
            customColumns={customColumns}
            eventsColumns={[
              {
                name: 'ide_empr', onChange: onChangeEmpresa
              },
            ]}
          />
        </Card>
      </DashboardContent>
    </>
  );
}
