/**
 * Página de edição de um produto específico
 * 
 * Este arquivo contém a página para editar um produto específico
 * dentro de um catálogo. Permite modificar todas as informações
 * do produto incluindo nome, descrição, preço, imagens e variações.
 * 
 * Funcionalidades principais:
 * - Edição de informações do produto
 * - Upload e remoção de imagens
 * - Gerenciamento de variações
 * - Validação de dados
 * - Integração com catálogo e produto específicos
 */

'use client'
// Importa componente de edição de produto
import EditProductContainer from "@/app/dashboard/catalogs/components/EditProductContainer"
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";

// Componente principal da página de edição de produto
export default function PAGE({params}) {
    // Extrai o ID do catálogo dos parâmetros da URL
    const catalogId = params.catalogId
    // Extrai o ID do produto dos parâmetros da URL
    const productId = params.productId
    return (
        {/* Renderiza o container de edição de produto com IDs do catálogo e produto */}
        <EditProductContainer catalogId={catalogId} productId={productId}/>
    )
}