import type { IFile, IgetFiles, IFileFilters } from 'src/types/file';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { toTitleCase } from 'src/utils/string-util';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { FILE_TYPE_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteFiles, useGetFiles, createFolder } from 'src/api/files/files';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { FileManagerTable } from '../file-manager-table';
import { FileManagerFilters } from '../file-manager-filters';
import { FileManagerGridView } from '../file-manager-grid-view';
import { FileManagerFiltersResult } from '../file-manager-filters-result';
import { FileManagerNewFolderDialog } from '../file-manager-new-folder-dialog';


// ----------------------------------------------------------------------
type Props = {
  currentProducto?: any;
};

export function FileManagerView({ currentProducto }: Props) {

  const [currentFolder, setCurrentFolder] = useState<IFile[]>([]);
  const [selectFolder, setSelectFolder] = useState<IFile>();
  const [folderName, setFolderName] = useState('');
  const [rootText, setRootText] = useState('');

  const table = useTable({ defaultRowsPerPage: 25 });

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const newFolder = useBoolean();

  const [view, setView] = useState('list');
  const [mode, setMode] = useState('files');

  const [tableData, setTableData] = useState<IFile[]>([]);

  const filters = useSetState<IFileFilters>({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const paramGetFiles: IgetFiles = useMemo(() => (
    {
      mode,
      ide_archi: selectFolder?.ide_arch,
      ide_inarti: currentProducto?.ide_inarti ? Number(currentProducto?.ide_inarti) : undefined
    }
  ), [mode, selectFolder?.ide_arch, currentProducto?.ide_inarti]);

  const { dataResponse, mutate } = useGetFiles(paramGetFiles);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.type.length > 0 ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  useEffect(() => {
    if (dataResponse.rows)
      setTableData(dataResponse.rows);
  }, [dataResponse]);

  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleChangeMode = useCallback(
    (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
      // borra
      setFolderName('');
      // setFilters(defaultFilters); ***
      setView('list');
      setSelectFolder(undefined);
      setCurrentFolder([]);


      if (newMode !== null) {
        setMode(newMode);
        if (newMode === 'files') {
          setRootText('')
        }
        else if (newMode === 'favorites') {
          setRootText('- Archivos Favoritos')
        }
        else if (newMode === 'trash') {
          setRootText('- Papelera')
        }
      }
    },
    []
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      await deleteFiles({ values: [id], trash: mode !== 'trash' })
      mutate();
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, mode, mutate, table, tableData]
  );

  const handleChangeFolder = useCallback(
    (row: IFile) => {
      if (row.type === 'folder') {
        setSelectFolder(row);
        setCurrentFolder([...currentFolder, row]);
      }
    },
    [currentFolder]
  );

  const handleSelectBreadcrumbs = useCallback(
    (index: number) => {
      if (index > 0) {
        setSelectFolder(currentFolder[index - 1])
        setCurrentFolder(currentFolder.slice(0, index));
      }
      else {
        setSelectFolder(undefined);
        setCurrentFolder([]);
      }
    },
    [currentFolder]
  );

  const handleDeleteItems = useCallback(async () => {
    await deleteFiles({ values: table.selected, trash: mode === 'trash' })
    mutate();
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, mode, mutate, table, tableData]);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FileManagerFilters
        filters={filters}
        dateError={dateError}
        onResetPage={table.onResetPage}
        openDateRange={openDateRange.value}
        onOpenDateRange={openDateRange.onTrue}
        onCloseDateRange={openDateRange.onFalse}
        options={{ types: FILE_TYPE_OPTIONS }}
      />
      <Stack direction="row" alignItems="end" justifyContent="flex-end">
        <ToggleButtonGroup size="small" value={mode} exclusive onChange={handleChangeMode}>
          <ToggleButton value="files">
            <Iconify icon="material-symbols:folder-data-outline" />
          </ToggleButton>
          <ToggleButton value="favorites">
            <Iconify icon="mi:favorite" />
          </ToggleButton>
          <ToggleButton value="trash">
            <Iconify icon="wpf:full-trash" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
          <ToggleButton value="list">
            <Iconify icon="solar:list-bold" />
          </ToggleButton>
          <ToggleButton value="grid">
            <Iconify icon="mingcute:dot-grid-fill" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      totalResults={dataFiltered.length}
      onResetPage={table.onResetPage}
    />
  );

  return (
    <>
      <DashboardContent>
        <Stack direction="row" alignItems="end" justifyContent="flex-end">
          <Button
            disabled={mode !== 'files'}
            variant="outlined"
            startIcon={<Iconify icon="material-symbols:create-new-folder" />}
            onClick={newFolder.onTrue}
          >
            Nueva Carpeta
          </Button>

          <Button
            disabled={mode !== 'files'}
            sx={{ ml: { xs: 3, md: 5 } }}
            variant="contained"
            startIcon={<Iconify icon="mage:file-upload-fill" />}
            onClick={upload.onTrue}
          >
            Subir Archivo
          </Button>

        </Stack>

        <Breadcrumbs aria-label="breadcrumb">
          <Link href="#" color="inherit" onClick={() => handleSelectBreadcrumbs(0)}>
            {toTitleCase(currentProducto?.nombre_inarti || 'Mi unidad')} {rootText}
          </Link>
          {currentFolder.map((folder: IFile, index: number) => (
            <Link
              href="#"
              key={index}
              color="inherit"
              onClick={() => handleSelectBreadcrumbs(index + 1)}
            >
              {folder.name}
            </Link>
          ))}
        </Breadcrumbs>

        <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent filled sx={{ py: 10 }} />
        ) : (
          <>
            {view === 'list' ? (
              <FileManagerTable
                table={table}
                dataFiltered={dataFiltered}
                onDeleteRow={handleDeleteItem}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
                mutate={mutate}
                onChangeFolder={handleChangeFolder}
                mode={mode}
              />
            ) : (
              <FileManagerGridView
                table={table}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
                mutate={mutate}
                selectFolder={selectFolder}
                currentProducto={currentProducto}
                onChangeFolder={handleChangeFolder}
              />
            )}
          </>
        )}
      </DashboardContent>

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse}
        mutate={mutate}
        selectFolder={selectFolder}
        currentProducto={currentProducto}
        onCreate={async () => {
          await createFolder({ folderName, sis_ide_arch: selectFolder?.ide_arch, ide_inarti: currentProducto?.ide_inarti ? Number(currentProducto?.ide_inarti) : undefined })
          newFolder.onFalse();
          setFolderName('');
          mutate();
          // console.info('CREATE NEW FOLDER', folderName);
        }}
        folderName={folderName}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            {mode !== 'trash' ? '¿Realmemte quieres enviar a la Papelera ' : '¿Realmemte quieres eliminar de forma permante '}<strong> {table.selected.length} </strong> elementos?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IFile[];
  filters: IFileFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
