import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductShopDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Product: Details</title>
      </Helmet>

      <ProductShopDetailsView id={`${id}`} />
    </>
  );
}
