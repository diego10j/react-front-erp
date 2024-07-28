import type { MutableRefObject } from "react";

export type UseTreeReturnProps = {
  selectionMode: 'single' | 'multiple';
  data: any[];
  isLoading: boolean;
  initialize: boolean,
  selectedItem: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  onRefresh: () => void;
  onReset: () => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
}

export type TreeProps = {
  ref: MutableRefObject<any>;
  restHeight: number;
  useTree: UseTreeReturnProps;
  // events
  onSelect?: (itemId: string) => void;
};
