import type { CustomColumn } from 'src/core/types';
import type { ITableQueryOpciones } from 'src/types/admin';

import { Helmet } from 'react-helmet-async';
import { useMemo, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { DataTable, useDataTable } from 'src/core/components/dataTable';
import { useListDataSistema, useTreeModelOpcion, useTableQueryOpcion } from 'src/api/sistema/admin';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Tree from '../../../core/components/tree/Tree';
import useTree from '../../../core/components/tree/useTree';
import { SaveIcon } from '../../../core/components/icons/CommonIcons';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Opciones',
  title: 'Listado de Opciones',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
};

export default function OpcionListPage() {

  const loadingSave = useBoolean();

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

  const dataTable = useDataTable({ config: useTableQueryOpcion(paramOpciones) });
  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_opci', visible: false,
    },
    {
      name: 'sis_ide_opci', visible: true, defaultValue: paramOpciones.sis_ide_opci, formControlled: true
    },
    {
      name: 'activo_opci', defaultValue: true,
    },
    {
      name: 'ide_sist', defaultValue: droSistema.value,
    },
  ], [paramOpciones.sis_ide_opci, droSistema.value]);


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

  const handleSelectTree= useCallback(
    (itemId: string) => {
        console.log(itemId);
    },
    []
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
                <DataTable
                  ref={dataTable.daTabRef}
                  useDataTable={dataTable}
                  editable
                  rows={50}
                  showRowIndex
                  numSkeletonCols={11}
                  customColumns={customColumns}
                  restHeight={400}
                />
              </Box>
            </Grid>
          </Grid>
        </Card>

      </DashboardContent >
    </>
  );
}
