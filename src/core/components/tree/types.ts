import { MutableRefObject } from "react";

export type UseTreeReturnProps = {
  selectionMode: 'single' | 'multiple';
  data: any[];
  isLoading: boolean;
  initialize: boolean,
  selected: string | string[];
  onRefresh: () => void;
  onSelectRow: (id: string) => void;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
}

export type TreeProps = {
  ref: MutableRefObject<any>;
  useTree: UseTreeReturnProps;
};
