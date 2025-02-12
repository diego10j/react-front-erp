import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

const metadata = { title: `Calendar | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CalendarView />
    </>
  );
}
