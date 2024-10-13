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
    // Buscar el filtro de la columna actual
    const currentColumnFilter = columnFilters.find(filter => filter.id === column.id);

    if (!currentColumnFilter || !currentColumnFilter.value) return []; // Si no hay filtro, no mostrar nada

    let filterValues = Array.isArray(currentColumnFilter.value) ? currentColumnFilter.value : [currentColumnFilter.value];
    // Comprobar si el array solo tiene elementos vacíos o nulos
    const isEmpty = filterValues.includes(null);
    if (isEmpty) {
      filterValues = filterValues.map(value => (value === null) ? '(Vacío)' : value)
    }

    return [
      {
        id: currentColumnFilter.id,
        value: filterValues.join(', '), // Mostrar '(Vacío)' si todos los elementos son null o vacíos
        label: column.columnDef.header || currentColumnFilter.id, // Mostrar el header de la columna si existe
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
