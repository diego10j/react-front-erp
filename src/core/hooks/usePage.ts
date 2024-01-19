import { useState } from 'react';
import { useSnackbar } from 'notistack';

import { save } from 'src/api/core';

import { ISave } from 'src/types/core';

import { ObjectQuery } from '../types/objectQuery';
import { UseDataTableReturnProps } from '../components/dataTable/types';


type UsePageReturnProps = {
  saveAll: (...useDataTable: UseDataTableReturnProps[]) => Promise<boolean>;
  loadingSave: boolean;
};

export function usePage(): UsePageReturnProps {

  const { enqueueSnackbar } = useSnackbar();
  const [loadingSave, setLoadingSave] = useState(false);
  const saveAll = async (...useDataTable: UseDataTableReturnProps[]): Promise<boolean> => {
    setLoadingSave(true);
    // Unifica listas ObjectQuery
    const listQuery: ObjectQuery[] = [];
    for (let i = 0; i < useDataTable.length; i += 1) {
      const table = useDataTable[i];
      const list = table.save();
      if (list.length > 0) {
        listQuery.push(...list);
      }
    }

    if (listQuery.length > 0) {
      try {
        const param: ISave = {
          listQuery
        }
        await save(param);
        // Actualiza Data commit
        for (let i = 0; i < useDataTable.length; i += 1) {
          const table = useDataTable[i];
          table.getInsertedRows().forEach((currentRow: any) => {
            const index = table.data.indexOf(currentRow);
            delete currentRow.insert;
            table.updateDataByRow(index, currentRow);
          });
          table.getUpdatedRows().forEach(async (currentRow: any) => {
            const index = table.data.indexOf(currentRow);
            delete currentRow.colsUpdate;
            table.updateDataByRow(index, currentRow);
          });
          table.clearListIdQuery();
        }
        enqueueSnackbar(`Datos guardados exitosamente`, { variant: 'success', });
      } catch (error) {
        enqueueSnackbar(`Error al guardar ${error}`, { variant: 'error', });
        return false;
      }
    }
    setLoadingSave(false);
    return true;
  }


  return {
    saveAll,
    loadingSave
  }

}

