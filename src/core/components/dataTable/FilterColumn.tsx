import type {
  SelectChangeEvent
} from '@mui/material';
import type { Column, ColumnFiltersState } from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';

import {
  Box,
  List, Stack, Select, Checkbox, ListItem, MenuItem,
  TextField, IconButton, ListItemText,
  TablePagination,
  FormControlLabel
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import FilterChip from './FilterChip';

export type FilterColumnProps = {
  column: Column<any, unknown>;
  columnFilters: ColumnFiltersState; // Tu array de filtros
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>; // Función para actualizar el array de filtros
};

const stringFilterOptions = ["Contiene", "No Contiene", "Comienza por", "No Comienza por", "Termina con", "No Termina con", "Es igual a", "No Es igual a"];
const numberFilterOptions = ["Contiene", "Es igual a", "No Es igual a", "Mayor que", "Mayor o igual que", "Menor que", "Menor o igual que"];
// const dateFilterOptions = ["Contiene", "Fecha Específica", "Rango de fechas"];


export default function FilterColumn({ column, columnFilters, setColumnFilters }: FilterColumnProps) {

  const columnFilterValue = Array.isArray(column.getFilterValue())
    ? (column.getFilterValue() as any[])
    : [];

  const configColumn: any = useMemo(() => column.columnDef, [column]);
  const dataType = useMemo(() => configColumn.dataType || 'String', [configColumn]);

  // Detectar el tipo de columna
  const isNumber = useMemo(() => dataType === 'Number' || dataType === 'Integer', [dataType]);
  const isBoolean = useMemo(() => dataType === 'Boolean', [dataType]);
  const isDate = useMemo(() => dataType === 'Date', [dataType]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Contiene'); // Default filter type for Strings
  const [selectAll, setSelectAll] = useState(false);

  const popover = usePopover();


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Máximo de registros por página


  // Obtener valores únicos y ordenarlos
  const sortedUniqueValues = useMemo(() => Array.from(column.getFacetedUniqueValues().keys())
    .map(value => {
      if (value == null) return ''; // Manejar valores null/undefined

      if (isNumber) {
        return value; // Devolver valores numéricos sin convertir a cadena
      } if (isBoolean) {
        return value ? 'True' : 'False'; // Convertir booleanos a cadenas legibles
      } if (isDate) {
        return new Date(value).toLocaleDateString(); // Convertir fechas a un formato legible
      }
      return value?.toString() || ''; // Convertir otros valores a cadena
    })
    .sort(), [column, isNumber, isBoolean, isDate]);

  // Filtrar valores basados en la búsqueda
  // const filteredValues = useMemo(() => sortedUniqueValues.filter(value => rankItem(value, searchTerm).passed), [searchTerm, sortedUniqueValues]);


  const filteredValues = useMemo(() => {
    if (searchTerm === '') {
      return sortedUniqueValues;
    }
    if (isNumber) {
      switch (filterType) {
        case 'Es igual a':
          return sortedUniqueValues.filter(value => Number(value) === Number(searchTerm));
        case 'No Es igual a':
          return sortedUniqueValues.filter(value => Number(value) !== Number(searchTerm));
        case 'Mayor que':
          return sortedUniqueValues.filter(value => Number(value) > Number(searchTerm));
        case 'Mayor o igual que':
          return sortedUniqueValues.filter(value => Number(value) >= Number(searchTerm));
        case 'Menor que':
          return sortedUniqueValues.filter(value => Number(value) < Number(searchTerm));
        case 'Menor o igual que':
          return sortedUniqueValues.filter(value => Number(value) <= Number(searchTerm));
        default:
          return sortedUniqueValues.filter(value => rankItem(value, searchTerm).passed);
      }
    }

    // if (isDate) {
    //   switch (filterType) {
    //     case 'Fecha Específica':
    //       return sortedUniqueValues.filter(value => {
    //         const dateValue = new Date(value).toLocaleDateString();
    //         return dateValue === new Date(searchTerm).toLocaleDateString();
    //       });
    //     case 'Rango de fechas':
    //       const [startDate, endDate] = searchTerm.split(','); // El formato de `searchTerm` debe ser "yyyy-MM-dd,yyyy-MM-dd"
    //       return sortedUniqueValues.filter(value => {
    //         const dateValue = new Date(value);
    //         return dateValue >= new Date(startDate) && dateValue <= new Date(endDate);
    //       });
    //     default:
    //       return sortedUniqueValues.filter(value => rankItem(value, searchTerm).passed);
    //   }
    // }

    // String filters
    switch (filterType) {
      case 'No Contiene':
        return sortedUniqueValues.filter(value => value == null || !rankItem(value, searchTerm).passed);
      case 'Termina con':
        return sortedUniqueValues.filter(value => value.toLowerCase().endsWith(searchTerm.toLowerCase()));
      case 'No Termina con':
        return sortedUniqueValues.filter(value => !value.toLowerCase().endsWith(searchTerm.toLowerCase()));
      case 'Comienza por':
        return sortedUniqueValues.filter(value => value.toLowerCase().startsWith(searchTerm.toLowerCase()));
      case 'No Comienza por':
        return sortedUniqueValues.filter(value => !value.toLowerCase().startsWith(searchTerm.toLowerCase()));
      case 'Es igual a':
        return sortedUniqueValues.filter(value => value.toLowerCase() === searchTerm.toLowerCase());
      case 'No Es igual a':
        return sortedUniqueValues.filter(value => value.toLowerCase() !== searchTerm.toLowerCase());
      default:
        return sortedUniqueValues.filter(value => rankItem(value, searchTerm).passed);
    }
  }, [isNumber, filterType, sortedUniqueValues, searchTerm]);

  // Valores a mostrar en la página actual
  const paginatedValues = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredValues.slice(start, end);
  }, [filteredValues, page, rowsPerPage]);


  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value as string);
  };


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked);
    const filterValues = sortedUniqueValues.map(value => value === '' ? null : value); // Reemplazar valores nulos
    // column.setFilterValue(filterValues.length ? filterValues : undefined);
    column.setFilterValue(event.target.checked ? filterValues : undefined);
  };

  const handleFilterChange = (value: any, checked: boolean) => {
    const currentFilter = [...columnFilterValue];

    if (checked) {
      let filterValue = value;
      // Verifica si el valor es "(Vacío)" y establece un valor específico
      if (value === '') {
        filterValue = null; // se puedes usar un string específico
      } else if (isNumber) {
        filterValue = Number(value);
      } else if (isBoolean) {
        filterValue = value === 'True';
      } else if (isDate) {
        filterValue = new Date(value).toISOString();
      }
      // Agrega el valor solo si no es ya parte del filtro
      if (!currentFilter.includes(filterValue)) {
        column.setFilterValue([...currentFilter, filterValue]);
      }
    } else {
      // Filtra el valor no seleccionado
      const updatedFilter = value === '' ? currentFilter.filter(item => item !== null) : currentFilter.filter(item => item !== value);
      // Actualizar el filtro con los valores restantes o eliminarlo si está vacío
      column.setFilterValue(updatedFilter.length ? updatedFilter : undefined);
    }
  };


  // Cambia la página actual
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Cambia la cantidad de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reinicia a la primera página al cambiar la cantidad de filas por página
  };

  return (
    <>
      <Stack spacing={0} direction="row" alignItems="center">
        <Box>
          <FilterChip
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            column={column}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="lucide:filter" width={16} />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <Stack sx={{ p: 2 }}>
          <Stack spacing={2} direction="column">
            <Select size="small" value={filterType} onChange={handleFilterTypeChange} fullWidth>
              {(isNumber ? numberFilterOptions : stringFilterOptions).map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            <TextField
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar"
              fullWidth
              size="small"
              variant="outlined"
            />
          </Stack>

          <Stack spacing={2} sx={{ pt: 2 }}>
            <List
              sx={{
                borderRadius: 2,
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                height: 300,
                overflowY: 'auto',
              }}
            >

              <MenuItem>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <ListItemText primary="(Seleccionar todo)" />
              </MenuItem>

              {paginatedValues.map(value => (
                <ListItem key={value} sx={{ pt: 0, pb: 0 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          columnFilterValue.includes(value) ||
                          (value === '' && columnFilterValue.includes(null))
                        } onChange={(e) => handleFilterChange(value, e.target.checked)}
                      />
                    }
                    label={value === 0 ? '0' : value || '(Vacío)'} // Mostrar '0' si el valor es 0, '(Vacío)' si es null, undefined o una cadena vacía
                  />
                </ListItem>
              ))}
            </List>

            {/* Componente de paginación */}
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]} // Opciones para la cantidad de filas por página
              component="div"
              count={filteredValues.length} // Total de registros
              rowsPerPage={rowsPerPage} // Filas por página actual
              page={page} // Página actual
              onPageChange={handleChangePage} // Manejar cambio de página
              onRowsPerPageChange={handleChangeRowsPerPage} // Manejar cambio de filas por página
            />
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );
}
