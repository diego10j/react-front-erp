import type { CustomColumn } from 'src/core/types';
import type { ITableQueryPerfil } from 'src/types/admin';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { DataTable, useDataTable } from 'src/core/components/dataTable';
import { useListDataSistema, useTableQueryPerfil } from 'src/api/sistema/admin';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SaveIcon } from '../../../core/components/icons/CommonIcons';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Perfiles',
  title: 'Listado de Perfiles',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
};

export default function PerfilPage() {

  const loadingSave = useBoolean();

  const droSistema = useDropdown({ config: useListDataSistema(), defaultValue: '1' });


  const [paramDataTable, setParamDataTable] = useState<ITableQueryPerfil>(
    {
      ide_sist: Number(droSistema.value),
    }
  );

  const dataTable = useDataTable({ config: useTableQueryPerfil(paramDataTable) });
  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_perf', visible: false,
    },
    {
      name: 'activo_perf', defaultValue: true,
    },
    {
      name: 'ide_sist', defaultValue: droSistema.value, visible: false, formControlled: true
    },
  ], [droSistema.value]);


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



  /**
   * Cuando selecciona un sistema
   */
  const handleChangeSistema = useCallback(
    (optionId: string) => {
      // reset dataTable
      dataTable.onReset();

      // Actualiza parametros de la dataTable
      setParamDataTable({
        ide_sist: Number(optionId),
      });
    },
    [dataTable]
  );


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

          <Box sx={{ p: 3 }}>
            <Dropdown
              label="Sistema"
              showEmptyOption={false}
              useDropdown={droSistema}
              onChange={handleChangeSistema}
            />
          </Box>
          <Box sx={{ px: 3 }}>
            <DataTable
              ref={dataTable.daTabRef}
              useDataTable={dataTable}
              editable
              rows={50}
              showRowIndex
              numSkeletonCols={5}
              customColumns={customColumns}
              restHeight={450}
            />
          </Box>
        </Card>
      </DashboardContent >
    </>
  );
}
