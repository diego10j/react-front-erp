import { Helmet } from 'react-helmet-async';

import { FaqsView } from 'src/sections/faqs/view';

// ----------------------------------------------------------------------

export default function FaqsPage() {
  return (
    <>
      <Helmet>
        <title> Faqs</title>
      </Helmet>

      <FaqsView />
    </>
  );
}
