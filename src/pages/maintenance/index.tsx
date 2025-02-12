import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MaintenanceView } from 'src/sections/maintenance/view';

// ----------------------------------------------------------------------

const metadata = { title: `Maintenance - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MaintenanceView />
    </>
  );
}
