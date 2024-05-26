import { useMemo, useState, useEffect, useCallback } from 'react';

import { Link, Stack, Button, Container, Breadcrumbs, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { FILE_TYPE_OPTIONS } from 'src/_mock';
import { deleteFiles, useGetFiles, createFolder } from 'src/api/files/files';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';

import { IFile, IgetFiles, IFileFilters, IFileFilterValue } from 'src/types/file';

import FileManagerTable from '../file-manager-table';
import FileManagerFilters from '../file-manager-filters';
import FileManagerGridView from '../file-manager-grid-view';
import FileManagerFiltersResult from '../file-manager-filters-result';
import FileManagerNewFolderDialog from '../file-manager-new-folder-dialog';


// ----------------------------------------------------------------------

const defaultFilters: IFileFilters = {
  name: '',
  type: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function FileManagerView() {

  const [currentFolder, setCurrentFolder] = useState<IFile[]>([]);
  const [selectFolder, setSelectFolder] = useState<IFile>();

  const paramGetFiles: IgetFiles = useMemo(() => (
    { ide_archi: selectFolder?.ide_arch }
  ), [selectFolder?.ide_arch]);

  const { dataResponse, mutate } = useGetFiles(paramGetFiles);

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 25 });

  const settings = useSettingsContext();

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const newFolder = useBoolean();
  const [folderName, setFolderName] = useState('');

  const [view, setView] = useState('list');

  const [tableData, setTableData] = useState<IFile[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  useEffect(() => {
    if (dataResponse.rows)
      setTableData(dataResponse.rows);
  }, [dataResponse]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name || !!filters.type.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleFilters = useCallback(
    (name: string, value: IFileFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteItem = useCallback(
    async (id: string) => {
      await deleteFiles({ values: [id] })
      mutate();

      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, mutate, table, tableData]
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
    console.log(table.selected);
    await deleteFiles({ values: table.selected })
    mutate();
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, mutate, table, tableData]);

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);


  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >



      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />

      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="end" justifyContent="flex-end">


          <Button
            variant="outlined"
            startIcon={<Iconify icon="material-symbols:create-new-folder" />}
            onClick={newFolder.onTrue}
          >
            Nueva Carpeta
          </Button>
          <Button
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
            Mi unidad
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

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
            }}
          />
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
              />
            ) : (
              <FileManagerGridView
                table={table}
                dataFiltered={dataFiltered}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
                mutate={mutate}
                selectFolder={selectFolder}
                onChangeFolder={handleChangeFolder}
              />
            )}
          </>
        )}
      </Container >

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} mutate={mutate} selectFolder={selectFolder}/>

      <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="Nueva Carpeta"
        mutate={mutate}
        onCreate={async () => {
          await createFolder({ folderName, sis_ide_arch: selectFolder?.ide_arch })
          newFolder.onFalse();
          setFolderName('');
          mutate();
          // console.info('CREATE NEW FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
        selectFolder={selectFolder}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={
          <>
           ¿Realmente quieres eliminar <strong> {table.selected.length} </strong> elementos?
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

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IFile[];
  comparator: (a: any, b: any) => number;
  filters: IFileFilters;
  dateError: boolean;
}) {
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
      inputData = inputData.filter((file) => isBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
