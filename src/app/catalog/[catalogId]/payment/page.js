/**
 * PÁGINA DE PAGAMENTO - CATÁLOGO
 * 
 * Este arquivo representa a página de finalização de compra/pagamento
 * de um catálogo específico. É uma rota dinâmica que recebe o ID do
 * catálogo como parâmetro da URL.
 * 
 * Funcionalidades:
 * - Busca dados do catálogo via API
 * - Renderiza a página de pagamento usando o componente CatalogPaymentPage
 * - Permite finalização de pedidos e coleta de dados do cliente
 * - Integra com sistema de carrinho de compras
 */

// Importa o componente que renderiza a página de pagamento
import CatalogPaymentPage from "@/app/catalog/components/CatalogPaymentPage";

// Define metadados estáticos para SEO da página
export const metadata = {
  title: "Pagamento", // Título que aparece na aba do navegador
};

// Componente principal da página de pagamento
export default async function PAGE ({params}) {
    // Faz uma requisição para buscar os dados do catálogo usando o ID do catálogo
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    // Converte a resposta em formato JSON
    const catalog = await response.json()

    // Renderiza o componente da página de pagamento passando os dados do catálogo
    return (
        <CatalogPaymentPage catalog={catalog} />
    )
}