import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PricingView } from 'src/sections/pricing/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pricing - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PricingView />
    </>
  );
}
