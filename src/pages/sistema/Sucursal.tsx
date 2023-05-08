import { useState, useMemo } from 'react';
// @mui
import { Container, Button, Stack, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';
// services
import { getNombreEmpresa } from '../../services/core/serviceSistema';
import { getTableQuerySucursales } from '../../services/core/serviceEmpresa';
import { getQueryEventosAuditoria } from '../../services/core/serviceAuditroia';
// components
import CalendarRangePicker, { useCalendarRangePicker } from '../../core/components/calendar';
import Dropdown, { useDropdown } from '../../core/components/dropdown';
import { useSettingsContext } from '../../components/settings/SettingsContext';
import { DataTableQuery, useDataTableQuery } from '../../core/components/dataTable';
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import ConfirmDialog from '../../components/confirm-dialog';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// util
import { TableQuery, CustomColumn } from '../../core/types';

// ----------------------------------------------------------------------

export default function Sucursal() {
    const { themeStretch } = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const querySucursal: TableQuery = getTableQuerySucursales();

    const customColumns: CustomColumn[] = useMemo(() => [
        {
            name: 'ide_sucu', visible: false
        },
        {
            name: 'ide_empr', visible: false
        },
    ], []);

    const tabSucursal = useDataTableQuery({ query: querySucursal, customColumns });


    return (
        <>
            <Helmet>
                <title>Sucursales</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Sucursales"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: getNombreEmpresa() },
                    ]}
                    action={
                        <Button
                            color="success"
                            variant="contained"
                            startIcon={<Iconify icon="ic:outline-add-circle-outline" />}
                        >
                            Nueva Sucursal
                        </Button>
                    }
                />
            </Container>
            <Card>

                <DataTableQuery
                    data={tabSucursal.data}
                    columns={tabSucursal.columns}
                    primaryKey={tabSucursal.primaryKey}
                    rows={50}
                    loading={tabSucursal.loading}
                    columnVisibility={tabSucursal.columnVisibility}
                    numSkeletonCols={7}
                    selectionMode={tabSucursal.selectionMode}
                    selected={tabSucursal.selected}
                    onRefresh={tabSucursal.onRefresh}
                    onSelectRow={tabSucursal.onSelectRow}
                    onSelectAllRows={tabSucursal.onSelectAllRows}
                    onSelectionModeChange={tabSucursal.onSelectionModeChange}
                />
            </Card>



        </>
    );
}
