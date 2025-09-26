// Este arquivo define o layout principal das páginas de um catálogo específico.
// Envolve todas as páginas do catálogo com o contexto e container apropriados.

import CatalogContainer from "@/app/catalog/components/CatalogContainer";
import { CatalogProvider } from "../../contexts/CatalogContext";

// Tempo de revalidação dos dados do catálogo (em segundos)
export const revalidate = 300;

// Função que gera metadados dinâmicos para cada catálogo
export async function generateMetadata({ params }) {
  const id = params.catalogId;

  // Busca os dados do catálogo pelo ID
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${id}`);
  const catalog = await response.json()

  // Retorna título e descrição personalizados para o catálogo
  return {
    title: {
      default: catalog.store_name,
      template: `%s - ${catalog.store_name}`
    },
    description: catalog.store_description,
  };
}

// Função principal que retorna o layout do catálogo
export default function LAYOUT({children, params}) {
    // Envolve as páginas do catálogo com o contexto e container
    return (
        <CatalogProvider>
            <CatalogContainer catalogId={params.catalogId}>
                {children}
            </CatalogContainer>
        </CatalogProvider>
    )
}