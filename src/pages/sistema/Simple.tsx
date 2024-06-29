
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetTableQuery } from 'src/api/core';
import { usePage } from 'src/core/hooks/usePage';
import { DataTable, useDataTable } from 'src/core/components/dataTable';

import { Iconify } from 'src/components/iconify';

import { CustomBreadcrumbs } from '../../components/custom-breadcrumbs';


// ----------------------------------------------------------------------

const tableName = "sis_sistema";
const primaryKey = "ide_sist";
const title = "Sistemas";

export default function Simple() {


  const refDataTable = useRef();
  const dataTable = useDataTable({ config: useGetTableQuery(tableName, primaryKey), ref: refDataTable });

  const { saveAll, loadingSave } = usePage();

  const onSave = async () => {
    if (await dataTable.isValidSave())
      await saveAll(dataTable);
  };


  return (
    <Container sx={{ mb: 10 }}>
      <Helmet>
        <title> {title}</title>
      </Helmet>
      <CustomBreadcrumbs
        links={[
          { name: 'Inicio', href: '/' },
          {
            name: 'Administrador',
            href: paths.dashboard.root,
          },
          { name: title },
        ]}
        action={
          <LoadingButton
            onClick={onSave}
            loading={loadingSave}
            color="success"
            variant="contained"
            startIcon={<Iconify icon="ic:round-save-as" />}
          >
            Guardar
          </LoadingButton>
        }
        sx={{ mb: 5 }}
      />

      <DataTable
        ref={refDataTable}
        useDataTable={dataTable}
        editable
        rows={50}
        showRowIndex
        numSkeletonCols={8}
      />

    </Container>
  );
}
