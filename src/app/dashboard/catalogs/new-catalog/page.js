/**
 * Página de criação de novo catálogo
 * 
 * Este arquivo contém a página para criar um novo catálogo.
 * É uma página simples que renderiza o componente de criação
 * de catálogo com formulário completo e pré-visualização.
 * 
 * Funcionalidades principais:
 * - Formulário de criação de catálogo
 * - Upload de banner
 * - Seleção de cores personalizadas
 * - Pré-visualização em tempo real
 * - Validação de dados
 */

// Importa componente de criação de catálogo
import CreateCatalogContainer from "@/app/dashboard/components/CreateCatalogContainer";

// Componente principal da página de novo catálogo
export default function PAGE() {
    return (
        {/* Renderiza o container de criação de catálogo */}
        <CreateCatalogContainer/>
    )
}