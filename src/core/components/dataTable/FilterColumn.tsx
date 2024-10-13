import type { Column, ColumnFiltersState } from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';

import {
  Box, List, Stack, Popover, Checkbox, ListItem, TextField,
  IconButton, TablePagination, FormControlLabel
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import FilterChip from './FilterChip';

export type FilterColumnProps = {
  column: Column<any, unknown>;
  columnFilters: ColumnFiltersState; // Tu array de filtros
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>; // Función para actualizar el array de filtros
};

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  const filteredValues = useMemo(() => sortedUniqueValues.filter(value => rankItem(value, searchTerm).passed), [searchTerm, sortedUniqueValues]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Máximo de registros por página

  // Valores a mostrar en la página actual
  const paginatedValues = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredValues.slice(start, end);
  }, [filteredValues, page, rowsPerPage]);

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
        <IconButton onClick={handleClick}>
          <Iconify icon="mdi:filter-variant" width={16} />
        </IconButton>
      </Stack>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: 16 }}>
          <TextField
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar"
            fullWidth
            size="small"
            variant="outlined"
          />
          <Stack spacing={2}>
            <List
              sx={{
                height: 300, // Establece la altura deseada para el List
                overflowY: 'auto', // Habilita el desplazamiento si el contenido excede la altura
              }}
            >
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
        </div>
      </Popover>
    </>
  );
}
