import { useState } from 'react';
// @mui
import { TextField, Stack } from '@mui/material';
import { Masonry } from '@mui/lab';
import {
  TimePicker,
  MobileTimePicker,
  StaticTimePicker,
  DesktopTimePicker,
} from '@mui/x-date-pickers';
//
import { Block } from '../../Block';

// ----------------------------------------------------------------------

export default function PickerTime() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <Block title="Basic">
        <TimePicker
          label="12 hours"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <TimePicker
          ampm={false}
          label="24 hours"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Block>

      <Block title="Responsiveness">
        <MobileTimePicker
          orientation="portrait"
          label="For mobile"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DesktopTimePicker
          label="For desktop"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <TimePicker
          value={value}
          onChange={setValue}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Block>

      <Block title="Static mode">
        <Stack spacing={3}>
          <StaticTimePicker
            orientation="portrait"
            displayStaticWrapperAs="mobile"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />

          <StaticTimePicker
            ampm
            orientation="landscape"
            openTo="minutes"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </Stack>
      </Block>
    </Masonry>
  );
}
