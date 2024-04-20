import CatalogProductPage from "@/app/components/CatalogProductPage";

export async function generateMetadata({ params }) {
  const id = params.catalogId;

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${id}`);
  const catalog = await response.json()

  const product = catalog.products.find(object => object.id === params.productId);

  return {
    title: product.name,
    description: catalog.store_description,
  };
}
  

export default async function PAGE({params}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    const catalog = await response.json()

    return (
        <CatalogProductPage catalog={catalog} params={params}/>
    )
}