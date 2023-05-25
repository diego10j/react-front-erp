import { useState } from 'react';
// @mui
import { TextField, Stack } from '@mui/material';
import { DateTimePicker, MobileDateTimePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
//
import { Block } from '../../Block';

// ----------------------------------------------------------------------

export default function PickerDateTime() {
  const [value, setValue] = useState<Date | null>(new Date());

  const [valueResponsive, setValueResponsive] = useState<Date | null>(
    new Date('2018-01-01T00:00:00.000Z')
  );

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
      <Block title="Basic">
        <DateTimePicker
          slotProps={{ textField: { fullWidth: true } }}
          label="DateTimePicker"
          value={value}
          onChange={setValue}
        />
      </Block>

      <Block title="Responsiveness">
        <MobileDateTimePicker
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DesktopDateTimePicker
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DateTimePicker
          value={valueResponsive}
          onChange={(newValue) => {
            setValueResponsive(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Block>
    </Stack>
  );
}
