


import type {
  FilterFn
} from '@tanstack/react-table';


// Filtrado global en todas las columnas incluidas ocultas
export const globalFilterFnImpl: FilterFn<any> = (row, columnId, value) => {
  const rowValues = row.getAllCells().map(cell => cell.getValue());

  // Verifica si algún valor en la fila incluye el valor del filtro
  const matches = rowValues.some(cellValue => String(cellValue).toLowerCase().includes(value.toLowerCase()));

  // Retorna si la fila debe ser incluida/excluida
  return matches;
};

// Filtrado numérico array
export const numberFilterFnImpl: FilterFn<number> = (row, columnId, filterValue) => {
  const cellValue = row.getValue<number | null>(columnId);
  
  if (!Array.isArray(filterValue)) return false;
  
  // Manejo explícito de null/undefined
  if (cellValue == null) return filterValue.includes(null);
  
  return filterValue.includes(cellValue);
};

// Implementación de booleanFilterFn
export const booleanFilterFnImpl: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId);

  // Comprobar si el valor de la celda es null
  if (cellValue === null) {
    // Retorna verdadero si el filtro incluye null
    return filterValue.includes(null);
  }


  // Verificar si el filtro es un array
  if (Array.isArray(filterValue)) {
    // Comprobar si el valor de la celda es exactamente igual a algún valor en el array de filtros
    return filterValue.includes(cellValue);
  }

  return false; // Excluir si no se cumple la condición
};

// ----
