import { Stack } from "@mui/material";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------
export type ActiveLabelProps = {
  active: boolean;
};

export default function ActiveLabel({ active }: ActiveLabelProps) {

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      {active ? (
        <>
          <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          <Label color="success">Activo</Label>
        </>
      ) : (
        <>
          <Iconify icon="solar:minus-circle-bold" sx={{ color: 'error.main' }} />
          <Label color="error">Inactivo</Label>
        </>
      )}
    </Stack>

  );
}

