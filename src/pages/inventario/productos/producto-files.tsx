import {
  Card,
} from '@mui/material';

import { FileManagerView } from "src/sections/file-manager/view";

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoFiles({ currentProducto }: Props) {

  return (
    <Card sx={{ pt: 3, pb: 0 }}>
      <FileManagerView currentProducto={currentProducto} />
    </Card>
  );

}
// {dialogType === 'createFolder' ? 'Create' : dialogType === 'rename' ? 'Rename' : 'Move'}
