import { Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------
export type ActiveLabelProps = {
  active: boolean;
};

export default function ActiveLabel({ active }: ActiveLabelProps) {

  return (
    <Stack spacing={1} direction="row" >
      <Iconify icon={active === true ? 'solar:check-circle-bold' : 'solar:minus-circle-bold'}
        sx={{
          color: active === true ? 'green' : 'red',
        }} />
      <Typography variant="body2" sx={{ color: active === true ? 'green' : 'red' }} noWrap>
        {active === true ? 'Activo' : 'Inactivo'}
      </Typography>
    </Stack>
  );
}

