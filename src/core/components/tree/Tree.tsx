

import { forwardRef, useImperativeHandle } from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { useScreenHeight } from 'src/hooks/use-responsive';

import { varAlpha, stylesMode } from 'src/theme/styles';

import type { TreeProps } from './types';

const StyledTree = styled(RichTreeView)(({ theme }) => ({
  overflowX: 'hidden',
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



const Tree = forwardRef(({ useTree, restHeight }: TreeProps, ref) => {

  const screenHeight = useScreenHeight();

  useImperativeHandle(ref, () => ({
    data
  }));

  const { data, onSelectItem } = useTree;


  return (
    <Box sx={{
      height: `${screenHeight - restHeight}px`,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 3,
      m: 0
    }}>
      <StyledTree
        slots={{ item: StyledTreeItem }}
        defaultExpandedItems={['root']}
        onItemSelectionToggle={onSelectItem}
        items={data}
      />
    </Box>
  );

});
export default Tree;
