// Importação do componente de navegação do catálogo
import CatalogNavbar from "./CatalogNavbar";
// Importação do componente de carrinho do catálogo
import CatalogCart from "./CatalogCart";

/**
 * Componente container para páginas de catálogo
 * Responsável por buscar os dados do catálogo e renderizar o layout com navegação e conteúdo
 * @param {React.ReactNode} children - Componentes filhos a serem renderizados no conteúdo
 * @param {string} catalogId - ID único do catálogo a ser carregado
 * @returns {Promise<JSX.Element>} Layout do catálogo com dados carregados
 */
export default async function CatalogContainer({children, catalogId}) {
    // Faz uma requisição para a API para obter os dados completos do catálogo
    // Inclui informações do catálogo e seus produtos
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${catalogId}`);
    // Converte a resposta para JSON
    const catalog = await response.json();

    // Renderiza o layout do catálogo
    return (
        <>
            {/* Barra de navegação específica do catálogo */}
            <CatalogNavbar catalog={catalog}/>
            {/* Container principal com estilos personalizados do catálogo */}
            <div
            className="min-h-screen"
            style={{
                color: catalog.text_color,           // Cor do texto definida no catálogo
                backgroundColor: catalog.primary_color // Cor de fundo principal do catálogo
            }}>
                {/* Componente de carrinho lateral */}
                <CatalogCart catalog={catalog}/>
                {/* Container centralizado para o conteúdo */}
                <div className="pt-2 px-4 w-full flex justify-center">
                    {/* Container com largura máxima para manter o layout responsivo */}
                    <div className="max-w-7xl w-full">
                        {children} {/* Renderiza o conteúdo da página */}
                    </div>
                </div>
            </div>
        </>
    )
}