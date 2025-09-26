// Importação do componente container para criação de catálogos
import CreateCatalogContainer from "@/app/dashboard/components/CreateCatalogContainer";

/**
 * Página para criação de novos catálogos
 * Renderiza o formulário completo de criação de catálogo
 * @returns {JSX.Element} Interface de criação de catálogo
 */
export default function PAGE() {
    // Renderiza o componente de criação de catálogo
    return (
        <CreateCatalogContainer/>
    )
}