import { Helmet } from 'react-helmet-async';

import PopoverView from 'src/sections/_examples/mui/popover-view';

// ----------------------------------------------------------------------

export default function PopoverPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Popover</title>
      </Helmet>

      <PopoverView />
    </>
  );
}
