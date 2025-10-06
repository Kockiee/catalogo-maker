/**
 * CONTAINER PRINCIPAL DO CATÁLOGO
 * 
 * Este arquivo contém o componente container principal que envolve
 * todas as páginas do catálogo. Fornece a estrutura base com navegação,
 * carrinho e layout personalizado baseado nas cores do catálogo.
 * 
 * Funcionalidades:
 * - Busca dados do catálogo via API
 * - Renderiza barra de navegação personalizada
 * - Inclui carrinho de compras lateral
 * - Aplica cores e estilos personalizados do catálogo
 * - Fornece layout responsivo para todas as páginas
 */

// Importa o componente da barra de navegação do catálogo
import CatalogNavbar from "./CatalogNavbar";
// Importa o componente do carrinho de compras
import CatalogCart from "./CatalogCart";

// Componente container principal do catálogo
export default async function CatalogContainer({children, catalogId}) {
    // Faz uma requisição para buscar os dados do catálogo usando o ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${catalogId}`);
    // Converte a resposta em formato JSON
    const catalog = await response.json();
    
    return (
        <>
            {/* Barra de navegação do catálogo */}
            <CatalogNavbar catalog={catalog}/>
            
            {/* Container principal com altura mínima e cores personalizadas */}
            <div
            className="min-h-screen"
            style={{color: catalog.text_color, backgroundColor: catalog.primary_color}}>
                {/* Carrinho de compras lateral */}
                <CatalogCart catalog={catalog}/>
                
                {/* Container de conteúdo principal */}
                <div className="pt-2 px-4 w-full flex justify-center">
                    {/* Container com largura máxima para centralizar o conteúdo */}
                    <div className="max-w-7xl w-full">
                        {/* Renderiza as páginas filhas (children) */}
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}