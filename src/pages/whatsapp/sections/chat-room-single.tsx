
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fPhoneNumber } from 'src/utils/phone-util';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';

// ----------------------------------------------------------------------

type Props = {
  participant: any;
};

export function ChatRoomSingle({ participant }: Props) {
  const collapse = useBoolean(true);

  const renderInfo = (
    <Stack alignItems="center" sx={{ py: 5 }}>
      <Avatar
        alt={participant?.nombre_whcha}
        sx={{ width: 96, height: 96, mb: 2 }}
      />
      <Typography variant="subtitle1">{participant?.nombre_whcha}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {participant?.name_whcha}
      </Typography>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      {[
        { icon: 'solar:phone-bold', value: fPhoneNumber(participant?.wa_id_whmem) },
        { icon: 'solar:calendar-date-bold', value: fDate(participant?.fecha_crea_whcha) },
        { icon: 'fluent:mail-24-filled', value: participant?.email },
      ].map((item) => (
        <Stack
          key={item.icon}
          spacing={1}
          direction="row"
          sx={{ typography: 'body2', wordBreak: 'break-all' }}
        >
          <Iconify icon={item.icon} sx={{ flexShrink: 0, color: 'text.disabled' }} />
          {item.value}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      {renderInfo}

      <CollapseButton selected={collapse.value} onClick={collapse.onToggle}>
        Información
      </CollapseButton>

      <Collapse in={collapse.value}>{renderContact}</Collapse>
    </>
  );
}
