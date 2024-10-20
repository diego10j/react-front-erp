import { useMemo, useEffect, useState, useCallback, createContext } from 'react';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEY } from '../config-settings';

import type { SettingsState, SettingsContextValue, SettingsProviderProps } from '../types';

// ----------------------------------------------------------------------

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsConsumer = SettingsContext.Consumer;

// ----------------------------------------------------------------------

export function SettingsProvider({ children, settings }: SettingsProviderProps) {
  const values = useLocalStorage<SettingsState>(STORAGE_KEY, settings);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [openSelectRol, setOpenSelectRol] = useState(false);

  // Si perfil no esta definido abre el Dialogo de seleccion de rol
  useEffect(() => {
    setOpenSelectRol(values.state.perfil === undefined);
  }, [values.state.perfil]);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);


  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const onToggleSelectRol = useCallback(() => {
    setOpenSelectRol((prev) => !prev);
  }, []);

  const onCloseSelectRol = useCallback(() => {
    setOpenSelectRol(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      ...values.state,
      canReset: values.canReset,
      onReset: values.resetState,
      onUpdate: values.setState,
      onUpdateField: values.setField,
      openDrawer,
      openSelectRol,
      onCloseDrawer,
      onCloseSelectRol,
      onToggleDrawer,
      onToggleSelectRol,
    }),
    [
      values.state,
      values.setField,
      values.setState,
      values.canReset,
      values.resetState,
      openDrawer,
      openSelectRol,
      onCloseDrawer,
      onCloseSelectRol,
      onToggleDrawer,
      onToggleSelectRol
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
