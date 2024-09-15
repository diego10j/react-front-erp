import { Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------
export type ActiveLabelProps = {
  active: boolean;
};

export default function ActiveLabel({ active }: ActiveLabelProps) {

  return (
    <Stack spacing={1} direction="row">
      {active ? (
        <>
          <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          <Typography variant="body2" sx={{ color: 'success.dark' }} noWrap>
            Activo
          </Typography>
        </>
      ) : (
        <>
          <Iconify icon="solar:minus-circle-bold" sx={{ color: 'error.main' }} />
          <Typography variant="body2" sx={{ color: 'error.dark' }} noWrap>
            Inactivo
          </Typography>
        </>
      )}
    </Stack>

  );
}

