
import { useState, useEffect, useCallback } from 'react';

import type { ResponseSWR } from '../../types';
import type { UseTreeReturnProps } from './types';

export type UseTreeProps = {
  config: ResponseSWR;
  title: string
};

export default function useTree(props: UseTreeProps): UseTreeReturnProps {


  const [initialize, setInitialize] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // selectionMode single fila seleccionada o editada

  // const getSelectedRows = () => props.ref.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];
  const { dataResponse, isLoading, mutate } = props.config;  // error, isValidating

  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
      }
      setSelectedItem(null);
      setData
        ([{
          id: 'root',
          label: props.title,
          children: dataResponse.rows
        }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);




  const onSelectItem = useCallback(
    (_event: React.SyntheticEvent,
      itemId: string,
      isSelected: boolean,) => {
      if (isSelected) {
        // console.log(itemId);
        setSelectedItem(itemId);
      }
    },
    []
  );


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





  return {
    data,
    initialize,
    isLoading,
    selectedItem,
    selectionMode,
    onRefresh,
    onSelectItem,
    onSelectionModeChange,
  }
}
