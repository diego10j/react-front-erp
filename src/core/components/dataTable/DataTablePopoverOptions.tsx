
import { ConfigIcon, RefreshIcon, DownloadIcon } from '../icons/CommonIcons';
import {
  Switch,
  Divider,
  Stack,
  MenuItem
} from '@mui/material';
import { CustomPopover, UsePopoverReturn } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

type DataTablePopoverOptionsProps = {
  popover: UsePopoverReturn;
  showSelectionMode: boolean;
  selectionMode: 'single' | 'multiple';
  showRowIndex: boolean;
  debug: boolean;
  setReadOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayIndex: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectionModeChange: (selectionMode: 'single' | 'multiple') => void;
  onRefresh: () => void;
  onExport: () => void;
  onCustom: () => void;

};

export default function DataTablePopoverOptions({ popover, showSelectionMode, selectionMode, showRowIndex, debug = false, setReadOnly, setDebug, setDisplayIndex, onSelectionModeChange, onRefresh, onExport, onCustom }: DataTablePopoverOptionsProps) {
  return (
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{
        paper: { sx: { p: 0, width: 220 } },
        arrow: { placement: 'right-top', offset: 20 }
      }}
    >
      <Stack sx={{ p: 2 }}>
        <MenuItem onClick={onRefresh}>
          <RefreshIcon />
          Actualizar
        </MenuItem>

        <MenuItem onClick={onExport}>
          <DownloadIcon />
          Exportar
        </MenuItem>
        {showSelectionMode && (
          <MenuItem>
            Selección Multiple
            <Switch
              checked={selectionMode === 'multiple'}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onSelectionModeChange(event.target.checked ? 'multiple' : 'single');
                if (setReadOnly)
                  setReadOnly(event.target.checked);
                popover.onClose();
              }
              }
            />
          </MenuItem>
        )}

        <MenuItem>
          Ver Número de Fila
          <Switch
            checked={showRowIndex}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDisplayIndex(event.target.checked);
              popover.onClose();
            }
            }
          />
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem>
          Debug
          <Switch
            checked={debug}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDebug(event.target.checked);
              popover.onClose();
            }
            }
          />
        </MenuItem>

        <MenuItem onClick={onCustom}>
          <ConfigIcon />
          Personalizar
        </MenuItem>
      </Stack>
    </CustomPopover>
  );
}
