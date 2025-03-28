import type { Theme, SxProps } from '@mui/material/styles';
import type { ThemeDirection, ThemeColorScheme } from 'src/theme/types';

// ----------------------------------------------------------------------

export type SettingsDrawerProps = {
  sx?: SxProps<Theme>;
  hideFont?: boolean;
  hideCompact?: boolean;
  hidePresets?: boolean;
  hideNavColor?: boolean;
  hideContrast?: boolean;
  hideDirection?: boolean;
  hideNavLayout?: boolean;
  hideColorScheme?: boolean;
};

export type SettingsState = {
  fontFamily: string;
  compactLayout: boolean;
  direction: ThemeDirection;
  colorScheme: ThemeColorScheme;
  contrast: 'default' | 'hight';
  navColor: 'integrate' | 'apparent';
  navLayout: 'vertical' | 'horizontal' | 'mini';
  primaryColor: 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';
  /* -- Propiedades del ERP -- */
  empresa?: {
    ide_empr: number;
    nom_empr: string;
    logo_empr?: string;
  };
  sucursal?: {
    ide_sucu: number;
    nom_sucu: string;
    logo_sucu?: string;
    identificacion_empr: string;
  };
  perfil?: {
    ide_perf: number;
    nom_perf: string;
    extra_util_usper: boolean;
  },
  menu: any[];
};

export type SettingsContextValue = SettingsState & {
  canReset: boolean;
  onReset: () => void;
  onUpdate: (updateValue: Partial<SettingsState>) => void;
  onUpdateField: (
    name: keyof SettingsState,
    updateValue: SettingsState[keyof SettingsState]
  ) => void;
  // Drawer
  openDrawer: boolean;
  openSelectRol: boolean;
  onCloseDrawer: () => void;
  onToggleDrawer: () => void;
  onCloseSelectRol: () => void;
  onToggleSelectRol: () => void;
};

export type SettingsProviderProps = {
  settings: SettingsState;
  children: React.ReactNode;
};
