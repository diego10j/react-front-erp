import { useRef, useMemo } from 'react';
// @mui
import { Container, Button, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';
// services
import { useSettingsContext } from 'src/components/settings';
// routes
import { paths } from 'src/routes/paths';
import { getNombreEmpresa } from '../../services/core/serviceSistema';
import { getTableQuerySucursales, getListDataEmpresa } from '../../services/core/serviceEmpresa';
// components
import { DataTable, useDataTable } from '../../core/components/dataTable';
import { usePage } from '../../core/hooks/usePage';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// util

// ----------------------------------------------------------------------

export default function Sucursal() {
    const { themeStretch } = useSettingsContext();

    const { save, loadingSave } = usePage();

    const refDataTable = useRef();
    const dataTable = useDataTable({ config: getTableQuerySucursales(), ref: refDataTable });

    const customColumns = useMemo(() => [
        {
            name: 'ide_sucu', visible: true, disabled: true
        },
        {
            name: 'nom_sucu', label: 'Nombre', required: true, unique: true
        },
        {
            name: 'ide_empr', dropDown: getListDataEmpresa(), visible: true
        },
    ], []);


    const onChangeEmpresa = (): void => {
        console.log(dataTable.index);
        console.log(dataTable.columns);
        dataTable.setValue(dataTable.index, 'Telefonos_sucu', 'xxxxx2');
        console.log(dataTable.getValue(dataTable.index, 'Telefonos_sucu'));
    };

    const onSave = async () => {
        if (await dataTable.isValidSave())
            await save(dataTable);
    };


    return (
        <>
            <Helmet>
                <title>Sucursales</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Sucursales"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: getNombreEmpresa() },
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
                />
            </Container>
            <Card>

                <DataTable
                    ref={refDataTable}
                    useDataTable={dataTable}
                    editable
                    rows={50}
                    numSkeletonCols={11}
                    customColumns={customColumns}
                    eventsColumns={[
                        {
                            name: 'ide_empr', onChange: onChangeEmpresa
                        },
                    ]}
                />
            </Card>
        </>
    );
}
