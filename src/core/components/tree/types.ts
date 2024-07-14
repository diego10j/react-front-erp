import type { MutableRefObject } from "react";

export type UseTreeReturnProps = {
  selectionMode: 'single' | 'multiple';
  data: any[];
  isLoading: boolean;
  initialize: boolean,
  selectedItem: string | null;
  onRefresh: () => void;
  onSelectItem: (event: React.SyntheticEvent, itemId: string, isSelected: boolean,) => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
}

export type TreeProps = {
  ref: MutableRefObject<any>;
  restHeight: number;
  useTree: UseTreeReturnProps;
};
