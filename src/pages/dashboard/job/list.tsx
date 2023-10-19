import { Helmet } from 'react-helmet-async';

import { JobListView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job List</title>
      </Helmet>

      <JobListView />
    </>
  );
}
