import { Helmet } from 'react-helmet-async';

import MultiLanguageView from 'src/sections/_examples/extra/multi-language-view';

// ----------------------------------------------------------------------

export default function MultiLanguagePage() {
  return (
    <>
      <Helmet>
        <title> Components: Multi Language</title>
      </Helmet>

      <MultiLanguageView />
    </>
  );
}
