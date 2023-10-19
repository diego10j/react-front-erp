import { Helmet } from 'react-helmet-async';

import FormValidationView from 'src/sections/_examples/extra/form-validation-view';

// ----------------------------------------------------------------------

export default function FormValidationPage() {
  return (
    <>
      <Helmet>
        <title> Components: Form Validation</title>
      </Helmet>

      <FormValidationView />
    </>
  );
}
