import type { ISave } from 'src/types/core';

import { useState } from 'react';

import { save } from 'src/api/core';

import { toast } from 'src/components/snackbar';

import type { ObjectQuery } from '../types/objectQuery';
import type { UseDataTableReturnProps } from '../components/dataTable/types';

type UsePageReturnProps = {
  saveAll: (...useDataTable: UseDataTableReturnProps[]) => Promise<boolean>;
  loadingSave: boolean;
};

export function usePage(): UsePageReturnProps {

  const [loadingSave, setLoadingSave] = useState(false);
  const saveAll = async (...useDataTable: UseDataTableReturnProps[]): Promise<boolean> => {
    setLoadingSave(true);
    // Unifica listas ObjectQuery
    const listQuery: ObjectQuery[] = [];
    for (let i = 0; i < useDataTable.length; i += 1) {
      const table = useDataTable[i];
      const list = table.saveDataTable();
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
          table.commitChanges();
        }
        toast.success(`Datos guardados exitosamente`);
      } catch (error) {
        setLoadingSave(false);
        toast.error(`Error al guardar ${error}`);
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

