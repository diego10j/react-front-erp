import { Helmet } from 'react-helmet-async';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

// @mui
import { Card, Switch, Button, Container, FormControlLabel } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

// types
import { CustomColumn } from 'src/core/types';
// api
import { useGetProductos } from 'src/api/productos';
import { DataTableQuery, useDataTableQuery } from 'src/core/components/dataTable';

// components
import { Iconify } from 'src/components/iconify';
import { Scrollbar} from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


// ----------------------------------------------------------------------

export default function ProductoListPage() {

  const router = useRouter();

  const [activos, setActivos] = useState(true);

  const refProductos = useRef();
  const config = useGetProductos();
  const tabProductos = useDataTableQuery({ config, ref: refProductos });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'activo_inarti', visible: false
    },
    {
      name: 'codigo_inarti', visible: false
    },
    {
      name: 'foto_inarti', component: 'Image', order: 1, label: ''
    },
    {
      name: 'fecha_compra', align: 'center'
    },
  ], []);


  // Filtra productos activos
  useEffect(() => {
    if (activos === true) {
      tabProductos.setColumnFilters([
        {
          "id": "activo_inarti",
          "value": true
        }
      ]);
    }
    else {
      tabProductos.setColumnFilters([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activos]);


  const handleEdit = useCallback(
    (row: any) => {
      router.push(paths.dashboard.productos.edit(row.uuid));
    },
    [router]
  );

  const onChangeActivos = () => {
    setActivos(!activos);
  };

  return (
    <>
      <Helmet>
        <title>Productos: Listado</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Lista de Productos"
          links={[
            {
              name: 'Productos',
              href: paths.dashboard.productos.root,
            },
            { name: 'Lista de Productos' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.productos.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo Producto
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Scrollbar>
            <DataTableQuery
              ref={refProductos}
              useDataTableQuery={tabProductos}
              customColumns={customColumns}
              rows={10}
              numSkeletonCols={7}
              heightSkeletonRow={60}
              height={680}
              showRowIndex
              actionToolbar={
                <FormControlLabel
                  label="Solo Productos Activos"
                  control={<Switch checked={activos} onChange={onChangeActivos} />}
                  sx={{
                    pl: 2,
                    py: 1.5,
                    top: 0,
                    position: {
                      sm: 'absolute',
                    },
                  }}
                />
              }
              eventsColumns={[
                {
                  name: 'nombre_inarti', onClick: handleEdit
                },
              ]}
            />
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}
