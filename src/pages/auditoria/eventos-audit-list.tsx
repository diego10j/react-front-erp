import React from 'react';
import type { CustomColumn } from 'src/core/types';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { addDaysDate } from 'src/utils/format-time';

import { useListDataUsuario } from 'src/api/sistema/usuarios';
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { DataTableQuery, useDataTableQuery } from 'src/core/components/dataTable';
import { useCalendarRangePicker } from 'src/core/components/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { convertDayjsToDate, formatStr } from '../../utils/format-time';
import { DashboardContent } from '../../layouts/dashboard/main';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { deleteEventosAuditoria, useGetEventosAuditoria } from '../../api/audit';
import { IGetEventosAuditoria } from '../../types/audit';


// ----------------------------------------------------------------------

const metadata = {
  header: 'Eventos Auditoria Usuarios',
  title: 'Eventos Auditoria',
  parent: { name: 'Auditoria', href: paths.dashboard.auditoria.root },
};


export default function EventosAuditoriaPage() {


  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -5)), dayjs(new Date()));

  const [paramsGetEventosAuditoria, setParamsGetEventosAuditoria] = useState<IGetEventosAuditoria>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
    }
  );


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_auac', visible: true
    },
    {
      name: 'fecha_auac', label: 'Fecha', order: 1, filter: false
    },
    {
      name: 'detallE_auac', label: 'Referencia', orderable: false

    },
    {
      name: 'pantalla', size: 250
    }
  ], []);

  const { dataResponse, isLoading, error, isValidating } = useGetEventosAuditoria(paramsGetEventosAuditoria);

  const tabAudit = useDataTableQuery({ config: { dataResponse, isLoading, error, isValidating } });

  const droUser = useDropdown({ config: useListDataUsuario() });
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDeleteAudit = async () => {
    if (startDate && endDate && tabAudit.selected) {
      const deleteParam = {
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
        ide_auac: tabAudit.selected as string[]
      }
      await deleteEventosAuditoria(deleteParam);
      tabAudit.onRefresh();
    }
  };

  const handleOpenConfirm = () => {
    if (tabAudit.selectionMode === 'multiple' && tabAudit.selected.length === 0)
      toast.warning('Selecciona al menos un registro');
    else
      setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleBuscar = () => {
    if (!isError) {
      setParamsGetEventosAuditoria({
        ...paramsGetEventosAuditoria,
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
        ide_usua: droUser.value ? Number(droUser.value) : undefined
      });
    } else {
      toast.warning('Fechas no válidas');
    }
  };

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
            <Button
              onClick={handleOpenConfirm}
              color="error"
              variant="contained"
              startIcon={<Iconify icon="ic:twotone-delete-outline" />}
            >
              {tabAudit.selectionMode === 'multiple' ? 'Eliminar Seleccionados' : 'Borrar Auditoria'}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{
              xs: 'column',
              md: 'row',
            }}
          >
            <DatePicker
              label="Fecha Inicio"
              value={startDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              defaultValue={null}
              format={formatStr.split.date}
              onChange={(newValue) => onChangeStartDate(newValue)}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <DatePicker
              label="Fecha Fin"
              value={endDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              defaultValue={null}
              format={formatStr.split.date}
              onChange={(newValue) => onChangeEndDate(newValue)}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <Dropdown
              label="Usuario"
              showEmptyOption
              emptyLabel="(TODOS LOS USUARIOS)"
              useDropdown={droUser}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isError}
              onClick={handleBuscar}
              startIcon={<Iconify icon="mingcute:search-2-fill" />}
            >
              Consultar
            </Button>
          </Stack>
          <DataTableQuery
            ref={tabAudit.daTabRef}
            useDataTableQuery={tabAudit}
            customColumns={customColumns}
            rows={50}
            defaultOrderBy='fecha_auac'
            numSkeletonCols={7}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar Auditoría"
        content={
          <>
            {tabAudit.selectionMode === 'multiple' ? `¿Estás seguro de que quieres eliminar ${tabAudit.selected.length} registros?`
              : '¿Estás seguro de que quieres eliminar los registros de Auditoría ?'}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteAudit();
              handleCloseConfirm();
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  );
}