
import { forwardRef, useImperativeHandle } from 'react';

import { Box, Card, Grid, Stack, CardContent } from '@mui/material';


import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { varAlpha, stylesMode } from 'src/theme/styles';


import type { TreeProps } from './types';



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



const Tree = forwardRef(({ useTree }: TreeProps, ref) => {


  useImperativeHandle(ref, () => ({
    data
  }));

  const { data } = useTree;



  // *******

  return (
    <RichTreeView
      aria-label="customized"
      sx={{ overflowX: 'hidden', minHeight: 240, width: 1 }}
      slots={{ item: StyledTreeItem }}
      items={data}
    />
  );

});
export default Tree;
