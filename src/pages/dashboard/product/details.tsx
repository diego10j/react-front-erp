import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Details</title>
      </Helmet>

      <ProductDetailsView id={`${id}`} />
    </>
  );
}
