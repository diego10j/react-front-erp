import { Helmet } from 'react-helmet-async';

import ProgressView from 'src/sections/_examples/mui/progress-view';

// ----------------------------------------------------------------------

export default function ProgressPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Progress</title>
      </Helmet>

      <ProgressView />
    </>
  );
}
