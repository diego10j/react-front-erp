import * as XLSX from 'xlsx';

import type { Column } from '../../types/column';

/**
 * Exporta los datos a un archivo Excel considerando solo las columnas visibles y su configuración.
 * @param {Array} columns - Las columnas del DataTable.
 * @param {Array} data - Los datos del DataTable.
 * @param {string} fileName - El nombre del archivo de Excel a exportar.
 */
export const exportDataTableToExcel = (columns: Column[], data: { [key: string]: any }, fileName: string = 'DataSheet.xlsx') => {
  // Filtrar columnas visibles
  const visibleColumns = columns.filter((col) => col.visible);

  // Preparar los encabezados del Excel usando los 'label' de las columnas
  const headers = visibleColumns.map((col) => col.label);

  // Transformar los datos para incluir solo las columnas visibles
  const filteredData = data.map((row: any) =>
    visibleColumns.reduce((acc: { [key: string]: any }, col) => {
      acc[col.name] = row[col.name];
      return acc;
    }, {})
  );

  // Crear la hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(filteredData);

  // Aplicar los encabezados en la primera fila
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  // Aplicar el tamaño de columnas según 'size'
  worksheet['!cols'] = visibleColumns.map((col) => ({
    wpx: col.size || 100, // wpx es el ancho en píxeles
  }));

  // Aplicar alineación a las celdas de la hoja de acuerdo a 'align'
  visibleColumns.forEach((col, index) => {
    const colLetter = String.fromCharCode(65 + index); // A, B, C, ...

    // Alineación para la columna
    const alignment = {
      horizontal: col.align === 'right' ? 'right' :
        col.align === 'center' ? 'center' :
          'left', // Fallback a 'left'
    };

    // Asignar alineación a todas las celdas de esa columna ARREGLAR ***
    // eslint-disable-next-line no-plusplus
    for (let rowIndex = 2; rowIndex <= filteredData.length + 1; rowIndex++) { // Empieza en la fila 2 para saltar los encabezados
      const cellAddress = `${colLetter}${rowIndex}`;
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = { alignment }; // Añadir la alineación
      }
    }
  });

  // Crear y exportar el archivo Excel
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  XLSX.writeFile(workbook, fileName);
};




/**
 * Exporta los datos a un archivo CSV considerando solo las columnas visibles y su configuración.
 * @param {Array} columns - Las columnas del DataTable.
 * @param {Array} data - Los datos del DataTable.
 * @param {string} fileName - El nombre del archivo CSV a exportar.
 */
export const exportDataTableToCSV = (columns: Column[], data: { [key: string]: any }[], fileName: string = 'DataSheet.csv') => {
  // Filtrar columnas visibles
  const visibleColumns = columns.filter((col) => col.visible);

  // Preparar los encabezados del CSV usando los 'label' de las columnas
  const headers = visibleColumns.map((col) => col.label);

  // Transformar los datos para incluir solo las columnas visibles
  const filteredData = data.map((row) =>
    visibleColumns.reduce((acc: { [key: string]: any }, col) => {
      acc[col.name] = row[col.name];
      return acc;
    }, {})
  );

  // Insertar los encabezados como la primera fila de datos
  const dataWithHeaders = [
    headers, // Primera fila con los encabezados
    ...filteredData.map(row => visibleColumns.map(col => row[col.name])) // Filas de datos
  ];

  // Crear la hoja de cálculo desde los datos con encabezados
  const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);

  // Convertir los datos a un formato CSV
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  // Descargar el archivo CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
