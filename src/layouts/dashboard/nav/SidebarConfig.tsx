// iconos
import DvrIcon from '@mui/icons-material/Dvr';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DashboardIcon from '@mui/icons-material/Dashboard';

// routes
import { paths } from '../../../routes/paths';

const getIconoMenu = (modulo: string) => {
  switch (modulo) {
    case 'dashboard':
      return <DashboardIcon style={{ width: '100%', height: '100%' }} />;
    case 'calendar':
      return <EventNoteIcon style={{ width: '100%', height: '100%' }} />;
    case 'auditoria':
      return <SecurityIcon style={{ width: '100%', height: '100%' }} />;
    case 'sistema':
      return <SettingsIcon style={{ width: '100%', height: '100%' }} />;
    default:
      return <DvrIcon style={{ width: '100%', height: '100%' }} />;
  }
};

const menu: any = [];

export const getMenuOpciones = () => {
  const menuUsuario = JSON.parse(localStorage.getItem('menu') || '') || [];
  menu.splice(0, menu.length);

  menu.push({
    subheader: 'GENERAL',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.general.app,
        icon: getIconoMenu('dashboard'),
      },
      { title: 'Calendario', path: paths.dashboard.calendar, icon: getIconoMenu('calendar') },
    ],
  });

  const hijos = [];
  for (let i = 0; i < menuUsuario.length; i += 1) {
    const opcionActual = menuUsuario[i];
    const itemsOpcion = [];
    if (opcionActual.items) {
      for (let j = 0; j < opcionActual.items.length; j += 1) {
        const itemActual = opcionActual.items[j];
        itemsOpcion.push({
          title: itemActual.label,
          path: `/dashboard/${itemActual.paquete}/${itemActual.ruta}`,
        });
      }
    }
    hijos.push({
      title: opcionActual.label,
      path: `/dashboard/${opcionActual.paquete}`,
      icon: getIconoMenu(opcionActual.paquete),
      children: itemsOpcion,
    });
  }
  menu.push({
    subheader: 'OPCIONES DEL SISTEMA',
    items: hijos,
  });
};

getMenuOpciones();

export default menu;
