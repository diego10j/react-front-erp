import type {
  Table,
  Column,
} from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';

import {
  List, Stack, Popover, Checkbox, ListItem, TextField, IconButton,
  TablePagination, FormControlLabel
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type FilterColumnProps = {
  column: Column<any, unknown>;
  table: Table<any>;
};

export default function FilterColumn({ column, table }: FilterColumnProps) {
  const columnFilterValue = Array.isArray(column.getFilterValue())
    ? (column.getFilterValue() as string[])
    : [];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener valores únicos y ordenarlos
  const sortedUniqueValues = useMemo(() =>
    Array.from(column.getFacetedUniqueValues().keys()).map(value => value?.toString() || '').sort(),
    [column]
  );

  // Filtrar valores basados en la búsqueda
  const filteredValues = useMemo(() =>
    sortedUniqueValues.filter(value => rankItem(value, searchTerm).passed),
    [searchTerm, sortedUniqueValues]
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string, checked: boolean) => {
    const currentFilter = [...columnFilterValue];
    if (checked) {
      column.setFilterValue([...currentFilter, value]);
    } else {
      column.setFilterValue(currentFilter.filter(item => item !== value));
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
      <IconButton onClick={handleClick}>
        <Iconify icon="mdi:filter-variant" sx={{ fontSize: 16 }} />
      </IconButton>
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
                <ListItem key={value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnFilterValue.includes(value)}
                        onChange={(e) => handleFilterChange(value, e.target.checked)}
                      />
                    }
                    label={value}
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
