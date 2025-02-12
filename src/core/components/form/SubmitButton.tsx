import type { BoxProps } from '@mui/material/Box';

import { LoadingButton } from '@mui/lab';

import { SaveIcon } from '../icons/CommonIcons';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  loading: boolean;
  disabled?: boolean;
  isUpdate: boolean;
  label?: string;
};

export function SubmitButton({ loading, isUpdate, label = '', disabled = false }: Props) {
  return (
    <LoadingButton
      type="submit"
      variant="contained"
      size="medium"
      startIcon={<SaveIcon />}
      sx={{ textTransform: 'capitalize' }}
      loading={loading}
      disabled={disabled}
    >
      {!isUpdate ? `Crear ${label}` : `Guardar ${label}`}
    </LoadingButton>

  );
}
