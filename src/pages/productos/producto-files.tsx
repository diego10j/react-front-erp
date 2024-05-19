
import { Card, CardHeader } from "@mui/material";

import { toTitleCase } from "src/utils/string-util";

import { FileManagerView } from "src/sections/file-manager/view";


// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoFiles({ currentProducto }: Props) {

  return (
    <Card>
      <CardHeader title={toTitleCase(currentProducto.nombre_inarti)} sx={{ mb: 2 }}
      />
      <FileManagerView />
    </Card>
  );

}
