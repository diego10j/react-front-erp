import * as XLSX from 'xlsx';
import { HotTable } from '@handsontable/react';
import  { useRef, useState, useEffect } from 'react';
import { registerAllModules } from 'handsontable/registry';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// register Handsontable's modules
registerAllModules();

type ExcelViewDialogProps = {
  url: string;
  title: string;
  open: boolean;
  onClose: () => void;
};
// import 'react-data-grid/lib/styles.css';

export default function ExcelViewDialog({ url, open, onClose, title = "Vista Previa" }: ExcelViewDialogProps) {

  const [data, setData] = useState<(string | number | boolean)[][]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const hotTableComponent = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        const headers = jsonData[0] as string[];
        const rowsData = jsonData.slice(1).map((row: any[]) => row);

        setColumns(headers);
        setData(rowsData);
      } catch (error) {
        console.error('Error loading Excel file', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [url, open]);

  const handleSave = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [columns, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'edited.xlsx');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Vista y Edición de Excel</DialogTitle>
      <DialogContent>
        <HotTable
          data={data}
          colHeaders={columns}
          rowHeaders
          width="100%"
          height="80vh"
          licenseKey="non-commercial-and-evaluation"
          ref={hotTableComponent}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Guardar
        </Button>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );

}
