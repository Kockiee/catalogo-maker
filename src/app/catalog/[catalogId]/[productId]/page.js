/**
 * PÁGINA DE PRODUTO INDIVIDUAL - CATÁLOGO
 * 
 * Este arquivo representa uma página dinâmica que exibe um produto específico
 * de um catálogo. É uma rota dinâmica que recebe o ID do catálogo e o ID do
 * produto como parâmetros da URL.
 * 
 * Funcionalidades:
 * - Busca dados do catálogo e produto específico via API
 * - Gera metadados dinâmicos para SEO baseados no produto
 * - Renderiza a página do produto usando o componente CatalogProductPage
 * - Permite visualização detalhada de um produto individual
 */

// Importa o componente que renderiza a página do produto
import CatalogProductPage from "@/app/catalog/components/CatalogProductPage";

// Função que gera metadados dinâmicos para SEO da página
export async function generateMetadata({ params }) {
  // Extrai o ID do catálogo dos parâmetros da URL
  const id = params.catalogId;

  // Faz uma requisição para buscar os dados do catálogo
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${id}`);
  // Converte a resposta em formato JSON
  const catalog = await response.json()

  // Encontra o produto específico dentro do catálogo usando o ID do produto
  const product = catalog.products.find(object => object.id === params.productId);

  // Retorna os metadados que serão usados para SEO
  return {
    title: product.name, // Título da página será o nome do produto
    description: catalog.store_description, // Descrição será a descrição da loja
  };
}
  

// Componente principal da página do produto
export default async function PAGE({params}) {
    // Faz uma nova requisição para buscar os dados do catálogo
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    // Converte a resposta em formato JSON
    const catalog = await response.json()

    // Renderiza o componente da página do produto passando os dados do catálogo e parâmetros
    return (
        <CatalogProductPage catalog={catalog} params={params}/>
    )
}