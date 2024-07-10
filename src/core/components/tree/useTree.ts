
import { useState, useEffect, useCallback } from 'react';

import type { UseTreeReturnProps } from './types';
import type { ResponseSWR } from '../../types';

export type UseTreeProps = {
  config: ResponseSWR;
  ref: any
};

export default function useTree(props: UseTreeProps): UseTreeReturnProps {


  const [initialize, setInitialize] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [selected, setSelected] = useState<any>(); // selectionMode single fila seleccionada o editada

  // const getSelectedRows = () => props.ref.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];

  const { dataResponse, isLoading, mutate } = props.config;  // error, isValidating

  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
      }
      setData(dataResponse.rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);


  /**
   * Actualiza la data
   */
  const onRefresh = async () => {

    const newData = await mutate();
    if (newData && newData.rows) {
      setData(newData.rows);
    }
  };


  const onSelectionModeChange = (_selectionMode: 'single' | 'multiple') => {
    setSelectionMode(_selectionMode)
    // setRowSelection({});
  };


  const onSelectRow = useCallback(
    (id: string) => {
      setSelected(id);
      // if (selectionMode === 'single') {
      //   setRowSelection({ [id]: true });
      // }
    },
    [selectionMode]
  );



  return {
    data,
    initialize,
    isLoading,
    selected,
    selectionMode,
    onRefresh,
    onSelectRow,
    onSelectionModeChange,
  }
}
