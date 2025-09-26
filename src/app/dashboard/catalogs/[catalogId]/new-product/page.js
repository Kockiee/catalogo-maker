// Importação do container de criação de produto
import CreateProductContainer from "@/app/dashboard/catalogs/components/CreateProductContainer"

/**
 * Página para criação de novos produtos em um catálogo específico
 * Rota dinâmica que renderiza o formulário de criação de produto
 * @param {Object} params - Parâmetros da URL
 * @param {string} params.catalogId - ID do catálogo onde o produto será criado
 * @returns {JSX.Element} Container de criação de produto
 */
export default function PAGE({params}) {
    // Renderiza o container de criação de produto com o ID do catálogo
    return (
        <CreateProductContainer catalogId={params.catalogId}/>
    )
}