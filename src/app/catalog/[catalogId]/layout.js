import CatalogContainer from "@/app/components/CatalogContainer";
import { CatalogProvider } from "../../contexts/CatalogContext";

export async function generateMetadata({ params }) {
  const id = params.catalogId;

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${id}`);
  const catalog = await response.json()

  return {
    title: {
      default: catalog.store_name,
      template: `%s - ${catalog.store_name}`
    },
    description: catalog.store_description,
  };
}

export default function LAYOUT({children, params}) {
    return (
        <CatalogProvider>
            <CatalogContainer catalogId={params.catalogId}>
                {children}
            </CatalogContainer>
        </CatalogProvider>
    )
}