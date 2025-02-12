import { Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------
export type ActiveLabelProps = {
  value: boolean;
};

export default function BooleanLabel({ value }: ActiveLabelProps) {

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
    >
      <Iconify
        icon="eva:checkmark-circle-2-outline"
        sx={{
          color: value === true ? 'success.main' : 'error.main',
        }}
      />
      {value === true ? 'Si' : 'No'}
    </Stack>
  );
}

