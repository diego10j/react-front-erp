

import { forwardRef, useCallback, useImperativeHandle } from 'react';

import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useScreenSize } from 'src/hooks/use-responsive';

import { varAlpha } from 'src/theme/styles';

import { Scrollbar } from 'src/components/scrollbar';

import TreeSkeleton from './TreeSkeleton';

import type { TreeProps } from './types';

const StyledTree = styled(RichTreeView)(() => ({
  overflow: 'hidden',
}));

const StyledScrollbar = styled(Scrollbar)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  p: 0,
  m: 0,
  backgroundColor: varAlpha(theme.vars.palette.text.disabledChannel, 0.03),
}));


const TreeCheckBox = forwardRef(({ useTree, restHeight, onSelect }: TreeProps, ref) => {

  const { height: screenHeight } = useScreenSize();

  useImperativeHandle(ref, () => ({
    data
  }));

  const { data, setSelectedItem, initialize, isLoading } = useTree;

  const handleSelectItem = useCallback(
    (_event: React.SyntheticEvent,
      itemId: string,
      isSelected: boolean,) => {
      if (isSelected) {
        // console.log(itemId);
        setSelectedItem(itemId);
        if (onSelect) {
          onSelect(itemId);
        }
      }
    },
    [onSelect, setSelectedItem]
  );

  return (
    <StyledScrollbar sx={{
      height: `${screenHeight - restHeight}px`,
    }}>
      {initialize === false || isLoading === true ? (
        <TreeSkeleton />
      ) : (
        <StyledTree
          multiSelect
          disableSelection
          checkboxSelection
          defaultExpandedItems={['root']}
          expansionTrigger="iconContainer"
          items={data}
        />
      )}

    </StyledScrollbar>

  );

});
export default TreeCheckBox;

