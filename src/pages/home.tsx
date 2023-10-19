import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Minimal: The starting point for your next project</title>
      </Helmet>

      <HomeView />
    </>
  );
}
