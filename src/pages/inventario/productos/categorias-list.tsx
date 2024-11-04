import type { CustomColumn } from 'src/core/types';
import type { IgetCategorias } from 'src/types/inventario/productos';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { save } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable, useDataTable } from 'src/core/components/dataTable';
import { useTreeModelCategorias, useTableQueryCategorias } from 'src/api/inventario/productos';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Tree from '../../../core/components/tree/Tree';
import useTree from '../../../core/components/tree/useTree';
import { SaveIcon } from '../../../core/components/icons/CommonIcons';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Categorias',
  title: 'Listado de Categorias',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
};

export default function CategoriasListPage() {

  const loadingSave = useBoolean();

  const configTree = useTreeModelCategorias();
  const treModel = useTree({ config: configTree, title: 'Categorias' });

  const [paramCategorias, setParamCategorias] = useState<IgetCategorias>(
    {
      inv_ide_incate: treModel.selectedItem === null ? undefined : Number(treModel.selectedItem)
    }
  );

  const dataTable = useDataTable({ config: useTableQueryCategorias(paramCategorias) });
  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_incate', visible: false,
    },
    {
      name: 'inv_ide_incate', visible: false, defaultValue: paramCategorias.inv_ide_incate, formControlled: true
    },
    {
      name: 'activo_incate', defaultValue: true,
    },

  ], [paramCategorias.inv_ide_incate]);


  const handleSave = async () => {
    loadingSave.onTrue();
    try {
      if (await dataTable.isValidSave()) {
        const listQuery = dataTable.saveDataTable();
        await save({ listQuery });
        dataTable.commitChanges();
        treModel.onRefresh();
        toast.success(`Se guardó exitosamente`);
      }
    } catch (error) {
      toast.error(`Error al guardar ${error}`);
    }
    loadingSave.onFalse();
  };

  /**
   * Cuando selecciona un nodo del Tree
   */
  const handleSelectTree = useCallback(
    (itemId: string) => {
      // reset de la dataTable
      dataTable.onReset();


      // Actualiza parametros de la dataTable
      setParamCategorias(prev => ({
        ...prev,
        inv_ide_incate: itemId === 'root' ? undefined : Number(itemId)
      }));
    },
    [dataTable]
  );



  const handleDeleteSuccess = useCallback(
    () => {

      treModel.onRefresh();
    },
    [treModel]
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



          <Grid container spacing={3} >
            <Grid item xs={12} md={4}>
              <Box sx={{ pl: 3 }}>
                <Tree useTree={treModel} restHeight={300} onSelect={handleSelectTree} />
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
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </Box>
            </Grid>
          </Grid>
        </Card>

      </DashboardContent >
    </>
  );
}
