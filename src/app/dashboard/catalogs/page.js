// Importação do componente de tabela de catálogos
import CatalogsTable from "@/app/dashboard/components/CatalogsTable";

/**
 * Página principal da seção de catálogos do dashboard
 * Exibe uma lista com todos os catálogos do usuário
 * @returns {JSX.Element} Interface da página de catálogos
 */
export default function PAGE() {
  // Renderiza o layout da página de catálogos
  return (
    <div className="flex-col space-y-2">
      {/* Título da página */}
      <h1 className="text-3xl font-bold">Seus catálogos</h1>
      {/* Tabela com lista de catálogos */}
      <CatalogsTable/>
    </div>
  );
};