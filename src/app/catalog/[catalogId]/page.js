/**
 * PÁGINA PRINCIPAL DO CATÁLOGO - LISTA DE PRODUTOS
 * 
 * Este arquivo representa a página principal de um catálogo específico,
 * onde são exibidos todos os produtos disponíveis. É uma rota dinâmica
 * que recebe o ID do catálogo como parâmetro da URL.
 * 
 * Funcionalidades:
 * - Busca dados do catálogo via API
 * - Exibe banner personalizado da loja
 * - Renderiza grid de produtos usando CatalogProductsGrid
 * - Permite navegação e compra de produtos
 * - Integra com sistema de carrinho de compras
 */

// Importa o componente que renderiza a grade de produtos
import CatalogProductsGrid from "@/app/catalog/components/CatalogProductsGrid";

// Componente principal da página do catálogo
export default async function PAGE({params}) {
    // Faz uma requisição para buscar os dados do catálogo usando o ID do catálogo
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    // Converte a resposta em formato JSON
    const catalog = await response.json()

    return(
        <div>
            {/* Banner da loja com imagem de fundo personalizada */}
            <div 
                className="bg-cover bg-center w-full h-56 mb-8 rounded" 
                style={{backgroundImage: `url("${catalog.banner_url}")`}} // Define a imagem de fundo usando a URL do banner
            ></div>
            
            {/* Componente que renderiza a grade de produtos do catálogo */}
            <CatalogProductsGrid catalog={catalog}/>
        </div>
    );
}