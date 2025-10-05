/**
 * Componente de tabela de catálogos do usuário
 * 
 * Este arquivo contém o componente que exibe todos os catálogos do usuário
 * em formato de tabela responsiva. Permite seleção múltipla, edição,
 * exclusão e criação de novos catálogos. É usado na página principal
 * do dashboard e na página de catálogos.
 * 
 * Funcionalidades principais:
 * - Exibição de todos os catálogos do usuário
 * - Seleção múltipla de catálogos
 * - Ações de editar e excluir catálogos
 * - Criação de novos catálogos
 * - Interface responsiva (tabela no desktop, cards no mobile)
 * - Notificações de feedback para o usuário
 */

'use client'
// Importa hooks do React para estado e efeitos
import { useState, useEffect } from "react";
// Importa ação para excluir catálogos
import { deleteCatalogs } from "@/app/actions/deleteCatalogs";
// Importa contexto de ferramentas para acessar dados
import { useTool } from "@/app/contexts/ToolContext";
// Importa componente Link do Next.js para navegação
import Link from 'next/link';
// Importa hook de notificações
import { useNotifications } from "../../hooks/useNotifications";
// Importa contexto de autenticação
import { useAuth } from "../../contexts/AuthContext";
// Importa componente de tabela responsiva
import ResponsiveTable from "../../components/ResponsiveTable";
// Importa componente de botões de ação
import ActionButtons from "../../components/ActionButtons";
// Importa componente de célula de tabela do Flowbite
import { TableCell } from "flowbite-react";

// Componente principal da tabela de catálogos
export default function CatalogsTable() {
    // Extrai dados do usuário do contexto de autenticação
    const { user } = useAuth();
    // Extrai catálogos e função de atualização do contexto de ferramentas
    const { catalogs, updateCatalogs } = useTool();
    // Estado que armazena os catálogos selecionados para ações em lote
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();

    // Efeito que atualiza a lista de catálogos quando o componente é montado
    useEffect(() => {
      updateCatalogs(); // Carrega os catálogos do usuário
    }, []); // Executa apenas uma vez

    // Função que alterna a seleção de um catálogo específico
    const toggleCatalogSelection = (catalogId) => {
      const selectedIndex = selectedCatalogs.findIndex(cat => cat.id === catalogId);
      if (selectedIndex !== -1) {
        // Se já está selecionado, remove da seleção
        const updatedSelectedCatalogs = [...selectedCatalogs];
        updatedSelectedCatalogs.splice(selectedIndex, 1);
        setSelectedCatalogs(updatedSelectedCatalogs);
      } else {
        // Se não está selecionado, adiciona à seleção
        const catalog = catalogs.find(cat => cat.id === catalogId);
        setSelectedCatalogs(prevState => [...prevState, { id: catalogId, whatsapp_session: catalog.whatsapp_session }]);
      }
    };

    // Função que seleciona/deseleciona todos os catálogos
    const handleSelectAll = () => {
      if (selectedCatalogs.length === catalogs.length) {
        // Se todos estão selecionados, deseleciona todos
        setSelectedCatalogs([]);
      } else {
        // Se nem todos estão selecionados, seleciona todos
        setSelectedCatalogs(catalogs.map(catalog => ({ id: catalog.id, whatsapp_session: catalog.whatsapp_session })));
      }
    };

    // Função que exclui os catálogos selecionados
    const handleDeleteCatalogs = async () => {
      notify.processing("Excluindo catálogos..."); // Mostra notificação de processamento
      await deleteCatalogs(selectedCatalogs, user.uid); // Executa a exclusão
      notify.catalogDeleted(); // Mostra notificação de sucesso
      setSelectedCatalogs([]); // Limpa a seleção
      updateCatalogs(); // Atualiza a lista de catálogos
    };

    // Função que renderiza uma linha da tabela para desktop
    const renderCatalogRow = (catalog, index) => (
      <>
        {/* Célula com nome do catálogo (link clicável) */}
        <TableCell className="whitespace-nowrap font-bold">
          <Link className="py-4 hover:underline text-primary-600" href={`/dashboard/catalogs/${catalog.id}`}>
            {catalog.name}
          </Link>
        </TableCell>
        {/* Célula com nome da loja */}
        <TableCell>
          {catalog.store_name}
        </TableCell>
        {/* Célula com quantidade de produtos */}
        <TableCell>
          {catalog.products.length}
        </TableCell>
        {/* Célula com data de criação formatada */}
        <TableCell>
          {new Date(catalog.created_at.seconds * 1000).toLocaleString()}
        </TableCell>
        {/* Célula com link para editar */}
        <TableCell>
          <Link href={`/dashboard/catalogs/${catalog.id}`} className="font-bold text-primary-400 hover:underline">
            Editar
          </Link>
        </TableCell>
      </>
    );

    // Função que renderiza um card para mobile
    const renderCatalogCard = (catalog, index) => (
      <div className="space-y-3">
        {/* Header do card com nome e botão editar */}
        <div className="flex justify-between items-start">
          <Link className="text-lg font-bold text-primary-600 hover:underline" href={`/dashboard/catalogs/${catalog.id}`}>
            {catalog.name}
          </Link>
          <Link href={`/dashboard/catalogs/${catalog.id}`} className="text-sm font-bold text-primary-400 hover:underline">
            Editar
          </Link>
        </div>
        
        {/* Grid com informações da loja e produtos */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Loja:</span>
            <p className="text-gray-800">{catalog.store_name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Produtos:</span>
            <p className="text-gray-800">{catalog.products.length}</p>
          </div>
        </div>
        
        {/* Data de criação */}
        <div className="text-sm">
          <span className="font-medium text-gray-600">Criado em:</span>
          <p className="text-gray-800">{new Date(catalog.created_at.seconds * 1000).toLocaleString()}</p>
        </div>
      </div>
    );

    // Define as colunas da tabela
    const columns = [
      { label: "Nome" },
      { label: "Loja" },
      { label: "Qtd. de Produtos" },
      { label: "Data de criação" },
      { label: "Ações" }
    ];

    return (
      <>
        {/* Componente de botões de ação (criar, editar, excluir) */}
        <ActionButtons
          selectedCount={selectedCatalogs.length} // Quantidade de itens selecionados
          onDelete={handleDeleteCatalogs} // Função para excluir catálogos
          onCreateHref="/dashboard/catalogs/new-catalog" // Link para criar novo catálogo
          onEditHref={selectedCatalogs.length === 1 ? `/dashboard/catalogs/${selectedCatalogs[0].id}` : "#"} // Link para editar (só funciona com 1 selecionado)
          createLabel="Criar Catálogo" // Texto do botão criar
          editLabel="Editar Catálogo" // Texto do botão editar
          deleteLabel="Deletar Catálogos" // Texto do botão excluir
        />
        
        {/* Tabela responsiva que exibe os catálogos */}
        <ResponsiveTable
          columns={columns} // Colunas da tabela
          data={catalogs || []} // Dados dos catálogos (array vazio se não houver)
          renderRow={renderCatalogRow} // Função para renderizar linha da tabela
          renderMobileCard={renderCatalogCard} // Função para renderizar card mobile
          onSelectAll={handleSelectAll} // Função para selecionar todos
          onSelectItem={toggleCatalogSelection} // Função para selecionar item individual
          selectedItems={selectedCatalogs.map(cat => cat.id)} // IDs dos itens selecionados
          selectable={true} // Permite seleção de itens
          emptyMessage="Você ainda não criou um catálogo." // Mensagem quando não há dados
        />
      </>   
    );
}

