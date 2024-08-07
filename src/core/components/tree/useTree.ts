
import { useState, useEffect } from 'react';

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
  const [selectedItem, setSelectedItem] = useState<string | null>('root'); // root

  // const getSelectedRows = () => props.ref.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];
  const { dataResponse, isLoading, mutate } = props.config;  // error, isValidating

  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
      }
      setData
        ([{
          id: 'root',
          label: props.title,
          children: dataResponse.rows
        }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);

  /**
   * Actualiza la data
   */
  const onRefresh = async () => {

    const newData = await mutate();
    if (newData && newData.rows) {
      setData
        ([{
          id: 'root',
          label: props.title,
          children: newData.rows
        }]);
    }
  };

  const onReset = async () => {
    setData
      ([{
        id: 'root',
        label: props.title,
        children: []
      }]);
    setSelectedItem('root');
  };


  const onSelectionModeChange = (_selectionMode: 'single' | 'multiple') => {
    setSelectionMode(_selectionMode)
  };


  return {
    data,
    initialize,
    isLoading,
    selectedItem,
    setData,
    selectionMode,
    onRefresh,
    onReset,
    setSelectedItem,
    onSelectionModeChange,
  }
}
