/**
 * Página de listagem de catálogos
 * 
 * Este arquivo contém a página principal onde o usuário pode
 * visualizar todos os seus catálogos em formato de tabela.
 * É uma página simples que exibe o título e o componente
 * de tabela de catálogos.
 * 
 * Funcionalidades principais:
 * - Exibição de todos os catálogos do usuário
 * - Interface de tabela responsiva
 * - Ações de gerenciamento (criar, editar, excluir)
 * - Navegação para páginas de detalhes
 */

// Importa componente de tabela de catálogos
import CatalogsTable from "@/app/dashboard/components/CatalogsTable";

// Componente principal da página de catálogos
export default function PAGE() {
  return (
    <div className="flex-col space-y-2">
      {/* Título da página */}
      <h1 className="text-3xl font-bold">Seus catálogos</h1>
      {/* Componente que exibe a tabela de catálogos */}
      <CatalogsTable/>
    </div>
  );
};