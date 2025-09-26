// Este arquivo define a página principal de exibição dos produtos de um catálogo.
// Busca os dados do catálogo pelo ID e renderiza o grid de produtos.

import CatalogProductsGrid from "@/app/catalog/components/CatalogProductsGrid";

// Função principal que retorna o conteúdo da página de produtos do catálogo
export default async function PAGE({params}) {
    // Busca os dados do catálogo usando o ID recebido via parâmetro
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    const catalog = await response.json()

    // Renderiza o banner do catálogo e o grid de produtos
    return(
        <div>
            <div className="bg-cover bg-center w-full h-56 mb-8 rounded" style={{backgroundImage: `url("${catalog.banner_url}")`}}></div>
            <CatalogProductsGrid catalog={catalog}/>
        </div>
    );
}