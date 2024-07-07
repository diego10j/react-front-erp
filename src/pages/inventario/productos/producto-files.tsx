import {
  Card,
  CardHeader,
} from '@mui/material';

import { FileManagerView } from "src/sections/file-manager/view";

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoFiles({ currentProducto }: Props) {

  return (
    <Card>
      <CardHeader title={(currentProducto.nombre_inarti)} sx={{ mb: 2 }}
      />
      <FileManagerView currentProducto={currentProducto}/>
    </Card>
  );

}
// {dialogType === 'createFolder' ? 'Create' : dialogType === 'rename' ? 'Rename' : 'Move'}
