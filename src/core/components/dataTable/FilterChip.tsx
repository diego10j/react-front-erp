import type { Column, ColumnFiltersState } from '@tanstack/react-table';

import React, { useMemo } from 'react';

import { Chip, Stack } from '@mui/material';

type FilterChipsProps = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  column: Column<any, unknown>;
};

export default function FilterChip({ columnFilters, setColumnFilters, column }: FilterChipsProps) {

  // Filtrar columnas que tienen un filtro activo y coinciden con la columna actual
  const filteredColumns = useMemo(() => {
    const currentColumnFilter = columnFilters.find(filter => filter.id === column.id);

    if (!currentColumnFilter?.value) return []; // Retornar vacío si no hay filtro o valor

    const filterValues = (Array.isArray(currentColumnFilter.value) ? currentColumnFilter.value : [currentColumnFilter.value])
      .map(value => value === null ? '(Vacío)' : value); // Reemplazar valores nulos por '(Vacío)'

    return [
      {
        id: currentColumnFilter.id,
        value: filterValues.join(', '), // Combinar valores en una cadena
        label: column.columnDef.header || currentColumnFilter.id // Mostrar el header o el id de la columna
      }
    ];
  }, [columnFilters, column]);


  // Manejo de eliminación de un filtro
  const handleDeleteFilter = (id: string) => {
    setColumnFilters(prevFilters => prevFilters.filter(filter => filter.id !== id));
  };

  return (
    <Stack direction="row" spacing={0}>
      {filteredColumns.map(filter => (
        <Chip
          key={filter!.id}
          sx={{
            maxWidth: column.getSize()
          }}
          label={filter!.value} // Mostrar '(Vacío)' si corresponde
          onDelete={() => handleDeleteFilter(filter!.id)} // Eliminar el filtro al hacer clic
          color="primary"
          variant="outlined"
          size="small"
        />
      ))}
    </Stack>
  );
}
