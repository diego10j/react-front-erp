import type { CustomColumn } from 'src/core/types';
import type { ITreeModelOpcion, ITableQueryPerfil } from 'src/types/admin';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Grid, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import useTree from 'src/core/components/tree/useTree';
import { DashboardContent } from 'src/layouts/dashboard';
import TreeCheckBox from 'src/core/components/tree/TreeCheckBox';
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { DataTableQuery, useDataTableQuery } from 'src/core/components/dataTable';
import { useListDataSistema, useTreeModelOpcion, useGetPerfilesSistema } from 'src/api/sistema/admin';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SaveIcon } from '../../../core/components/icons/CommonIcons';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Asignar Opciones a Perfil',
  title: 'Opciones Perfil',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
};

export default function PerfilOpcionPage() {

  const loadingSave = useBoolean();

  const droSistema = useDropdown({ config: useListDataSistema(), defaultValue: '1' });

  const [paramTreeModel, setParamTreeModel] = useState<ITreeModelOpcion>(
    {
      ide_sist: Number(droSistema.value),
    }
  );


  const configTree = useTreeModelOpcion(paramTreeModel);
  const treModel = useTree({ config: configTree, title: 'Opciones' });


  const [paramDataTable, setParamDataTable] = useState<ITableQueryPerfil>(
    {
      ide_sist: Number(droSistema.value),
    }
  );


  const dataTable = useDataTableQuery({ config: useGetPerfilesSistema(paramDataTable) });
  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_perf', visible: false,
    },
    {
      name: 'nom_perf', label: 'Perfil',
    },
    {
      name: 'nombre_corto_sist', label: 'Sistema',
    },
  ], []);


  const handleSave = async () => {
    loadingSave.onTrue();
    try {

      toast.success(`Se guardó exitosamente`);

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
      // reset del tree
      treModel.onReset();
      // reset dataTable
      // dataTable.onReset();
      // Actualiza parametros del Tree
      setParamTreeModel({
        ide_sist: Number(optionId),
      });
      // Actualiza parametros de la dataTable
      setParamDataTable({
        ide_sist: Number(optionId),
      });
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



          <Grid container spacing={3} >
            <Grid item xs={12} md={6}>
              <Box sx={{ px: 3, pb: 3, }}>
                <DataTableQuery
                  ref={dataTable.daTabRef}
                  useDataTableQuery={dataTable}
                  rows={100}
                  numSkeletonCols={5}
                  customColumns={customColumns}
                  restHeight={400}
                  showPagination={false}
                  showDelete={false}
                  showOptions={false}
                  showRowIndex
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: 3, pb: 3, pl: 0 }}>
                <TreeCheckBox useTree={treModel} restHeight={280} />
              </Box>
            </Grid>
          </Grid>

        </Card>
      </DashboardContent >
    </>
  );
}
