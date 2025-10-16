/**
 * Página de criação de novo produto para um catálogo específico
 * 
 * Este arquivo contém a página para criar um novo produto
 * dentro de um catálogo específico. É uma página simples que
 * renderiza o componente de criação de produto com o ID do catálogo.
 * 
 * Funcionalidades principais:
 * - Formulário de criação de produto
 * - Upload de imagens
 * - Definição de variações
 * - Validação de dados
 * - Integração com catálogo específico
 */

// Importa componente de criação de produto
import CreateProductContainer from "@/app/dashboard/catalogs/components/CreateProductContainer"

// Componente principal da página de novo produto
export default function PAGE({params}) {
    return (
        /* Renderiza o container de criação de produto com ID do catálogo */
        <CreateProductContainer catalogId={params.catalogId}/>
    )
}