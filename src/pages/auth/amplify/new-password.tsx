import { Helmet } from 'react-helmet-async';

import { AmplifyNewPasswordView } from 'src/sections/auth/amplify';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Amplify: New Password</title>
      </Helmet>

      <AmplifyNewPasswordView />
    </>
  );
}
