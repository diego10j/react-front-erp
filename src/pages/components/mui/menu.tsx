import { Helmet } from 'react-helmet-async';

import MenuView from 'src/sections/_examples/mui/menu-view';

// ----------------------------------------------------------------------

export default function MenuPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Accordion</title>
      </Helmet>

      <MenuView />
    </>
  );
}
