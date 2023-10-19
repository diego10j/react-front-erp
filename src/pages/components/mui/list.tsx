import { Helmet } from 'react-helmet-async';

import ListView from 'src/sections/_examples/mui/list-view';

// ----------------------------------------------------------------------

export default function ListPage() {
  return (
    <>
      <Helmet>
        <title> MUI: List</title>
      </Helmet>

      <ListView />
    </>
  );
}
