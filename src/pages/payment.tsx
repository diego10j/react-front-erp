import { Helmet } from 'react-helmet-async';

import { PaymentView } from 'src/sections/payment/view';

// ----------------------------------------------------------------------

export default function PaymentPage() {
  return (
    <>
      <Helmet>
        <title> Payment</title>
      </Helmet>

      <PaymentView />
    </>
  );
}
