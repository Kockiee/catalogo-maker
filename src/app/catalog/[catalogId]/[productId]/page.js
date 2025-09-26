// Importação do componente da página de produto do catálogo
import CatalogProductPage from "@/app/catalog/components/CatalogProductPage";

/**
 * Função para gerar metadados dinâmicos da página de produto
 * Executada no servidor durante a build/SSG para melhorar SEO
 * @param {Object} params - Parâmetros da URL
 * @param {string} params.catalogId - ID do catálogo
 * @param {string} params.productId - ID do produto
 * @returns {Object} Metadados para SEO (título, descrição)
 */
export async function generateMetadata({ params }) {
  const id = params.catalogId;

  // Busca os dados do catálogo da API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${id}`);
  const catalog = await response.json()

  // Encontra o produto específico no catálogo
  const product = catalog.products.find(object => object.id === params.productId);

  // Retorna metadados otimizados para SEO
  return {
    title: product.name,                    // Título da página baseado no nome do produto
    description: catalog.store_description, // Descrição da loja para SEO
  };
}
  

/**
 * Componente da página de produto individual do catálogo público
 * Rota dinâmica que exibe detalhes completos de um produto específico
 * @param {Object} params - Parâmetros da URL
 * @param {string} params.catalogId - ID do catálogo
 * @param {string} params.productId - ID do produto
 * @returns {JSX.Element} Componente da página de produto
 */
export default async function PAGE({params}) {
    // Busca os dados completos do catálogo (incluindo produtos) da API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    const catalog = await response.json()

    // Renderiza o componente da página de produto com os dados obtidos
    return (
        <CatalogProductPage catalog={catalog} params={params}/>
    )
}