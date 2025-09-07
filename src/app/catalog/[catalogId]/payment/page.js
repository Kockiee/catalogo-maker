import CatalogPaymentPage from "@/app/catalog/components/CatalogPaymentPage";

export const metadata = {
  title: "Pagamento",
};

export default async function PAGE ({params}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    const catalog = await response.json()

    return (
        <CatalogPaymentPage catalog={catalog} />
    )
}