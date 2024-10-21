import type { CustomColumn } from 'src/core/types';
import type { ITableQueryHorarios } from 'src/types/sistema/admin';

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
import { useListDataTiposHorario, useTableQueryHorario } from 'src/api/sistema/seguridad';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SaveIcon } from 'src/core/components/icons/CommonIcons';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Gestión de Horarios',
  title: 'Horarios',
  parent: { name: 'Seguridad', href: paths.dashboard.seguridad.root },
};


export default function HorariosListPage() {

  const loadingSave = useBoolean();

  const droTipoHorario = useDropdown({ config: useListDataTiposHorario(), defaultValue: '1' });

  const [params, setParams] = useState<ITableQueryHorarios>(
    {
      ide_tihor: Number(droTipoHorario.value),
    }
  );

  const dataTable = useDataTable({ config: useTableQueryHorario(params) });
  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_hora', visible: false,
    },
    {
      name: 'activo_hora', defaultValue: true,
    },
    {
      name: 'ide_tihor', defaultValue: droTipoHorario.value, visible: false, formControlled: true
    },
  ], [droTipoHorario.value]);


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
   * Cuando selecciona un tipo horario
   */
  const handleChangeTipoHorario = useCallback(
    (optionId: string) => {
      // reset dataTable
      dataTable.onReset();
      // Actualiza parametros de la dataTable
      setParams(prev => ({ ...prev, ide_tihor: Number(optionId) }));
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
        <Card>

          <Box sx={{ p: 3 }}>
            <Dropdown
              label="Tipo de Horario"
              showEmptyOption={false}
              useDropdown={droTipoHorario}
              onChange={handleChangeTipoHorario}
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
