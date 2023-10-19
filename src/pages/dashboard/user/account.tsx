import { Helmet } from 'react-helmet-async';

import { AccountView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Account Settings</title>
      </Helmet>

      <AccountView />
    </>
  );
}
