import type { IUuid } from 'src/types/core';
import type { IgetSaldoCliente } from 'src/types/ventas/clientes';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import Skeleton from '@mui/material/Skeleton';
import { Tab, Box, Tabs, Stack, Avatar, Tooltip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { getUrlImagen } from 'src/api/sistema/files';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCliente, useGetSaloCliente } from 'src/api/ventas/clientes';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ClienteTrn from './cliente-trn';
import ClienteCard from './sections/cliente-card';
import ClienteProductos from './cliente-productos';



// ----------------------------------------------------------------------
const TABS = [
  {
    value: 'general',
    label: 'Cliente',
    icon: <Iconify icon="fluent:chart-person-24-regular" width={24} />
  },
  {
    value: 'transacciones',
    label: 'Transacciones',
    icon: <Iconify icon="fluent:table-calculator-20-regular" width={24} />
  },
  {
    value: 'productos',
    label: 'Productos',
    icon: <Iconify icon="fluent:people-money-24-regular" width={24} />
  },
  {
    value: 'estadisticas',
    label: 'Tablero',
    icon: <Iconify icon="carbon:dashboard-reference" width={24} />
  },
];


const metadata = { title: `Detalles del Cliente` };

export default function ClienteDetailsPage() {

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  const params = useParams();

  const { id } = params; // obtiene parametro id de la url

  const paramsUuid: IUuid = useMemo(() => ({
    uuid: id || ''
  }), [id]);

  // Busca los datos por uuid
  const { dataResponse: dataResponseClie, isLoading: isLoadingClie } = useGetCliente(paramsUuid);

  const currentCliente = useMemo(() => dataResponseClie?.row?.cliente || {}, [dataResponseClie]);

  const paramGetSaldo: IgetSaldoCliente = useMemo(() => (
    { ide_geper: Number(currentCliente?.ide_geper || 0) }
  ), [currentCliente]);
  const { dataResponse, isLoading } = useGetSaloCliente(paramGetSaldo);


  const renderTabContent = useCallback(() => {
    if (isLoadingClie) return null;
    switch (currentTab) {
      case 'general':
        return <ClienteCard data={dataResponseClie.row} />;
      case 'transacciones':
        return <ClienteTrn currentCliente={currentCliente} />;
      case 'productos':
        return <ClienteProductos currentCliente={currentCliente} />;
      default:
        return null;
    }
  }, [currentCliente, currentTab, dataResponseClie.row, isLoadingClie]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Detalles del Cliente"
          links={[
            {
              name: 'Listado de Clientes',
              href: paths.dashboard.ventas.clientes.list,
            },
            { name: currentCliente.nom_geper },
          ]}
          sx={{
            mb: 2,
          }}
        />



        <Stack
          spacing={1.5}
          direction="row"
          alignItems="center"
          sx={{
            mb: 1,
          }}
        >

          <Box sx={{ flexGrow: 1 }} >
            <Stack direction="row" spacing={1}>
              {currentCliente.foto_geper ? (
                <Avatar
                  alt={currentCliente.nom_geper}
                  src={getUrlImagen(currentCliente.foto_geper)}
                  sx={{ width: 64, height: 64 }}
                />
              ) : (
                <Avatar
                  alt={currentCliente.nom_geper}
                  sx={{ width: 64, height: 64, bgcolor: 'background.neutral' }}
                >
                  <Iconify icon={currentCliente.ide_getip === '1' ? 'fluent:person-24-regular' : 'fluent:building-people-24-regular'} width={48} sx={{ color: 'text.secondary' }} />
                </Avatar>
              )}

              <Stack direction="column">
                <Typography variant="h6">
                  {currentCliente.nom_geper}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" noWrap>
                  {currentCliente.identificac_geper}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Tooltip title="Saldo">
            {isLoading ? (
              <Skeleton variant="rounded" width={135} height={36} />
            ) : (
              <Label variant="soft" sx={{ ml: 2, color: 'primary.main' }}>
                <Typography variant="h4" sx={{ pr: 2 }}>
                  {dataResponse?.rowCount === 0
                    ? `${fCurrency(0)}`
                    : `${fCurrency(dataResponse?.rows?.[0]?.saldo) ?? `${fCurrency(0)}`}`}
                </Typography>
              </Label>
            )}
          </Tooltip>


        </Stack>


        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>


        {renderTabContent()}


      </DashboardContent>
    </>
  );
}
