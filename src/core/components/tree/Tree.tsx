

import { forwardRef, useCallback, useImperativeHandle } from 'react';

import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { useScreenSize } from 'src/hooks/use-responsive';

import { varAlpha, stylesMode } from 'src/theme/styles';

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
  backgroundColor: varAlpha(theme.vars.palette.text.disabledChannel, 0.05),
}));

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.vars.palette.grey[800],
  [stylesMode.dark]: { color: theme.vars.palette.grey[200] },
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: { fontSize: '0.8rem', fontWeight: 500 },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.25),
    [stylesMode.dark]: {
      color: theme.vars.palette.primary.contrastText,
      backgroundColor: theme.vars.palette.primary.dark,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${varAlpha(theme.vars.palette.text.primaryChannel, 0.4)}`,
  },
}));



const Tree = forwardRef(({ useTree, restHeight, onSelect }: TreeProps, ref) => {

  const {height : screenHeight} = useScreenSize();

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
          slots={{ item: StyledTreeItem }}
          defaultExpandedItems={['root']}
          defaultSelectedItems={['root']}
          onItemSelectionToggle={handleSelectItem}
          expansionTrigger="iconContainer"
          items={data}
        />
      )}

    </StyledScrollbar>

  );

});
export default Tree;

