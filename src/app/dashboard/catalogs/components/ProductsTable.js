/**
 * Componente de tabela de produtos de um catálogo
 * 
 * Este arquivo contém o componente que exibe todos os produtos
 * de um catálogo específico em formato de tabela responsiva.
 * Permite seleção múltipla, edição, exclusão e criação de
 * novos produtos.
 * 
 * Funcionalidades principais:
 * - Exibição de todos os produtos do catálogo
 * - Seleção múltipla de produtos
 * - Ações de editar e excluir produtos
 * - Criação de novos produtos
 * - Interface responsiva (tabela no desktop, cards no mobile)
 * - Notificações de feedback para o usuário
 */

'use client'

// Importa hooks do React para estado e efeitos
import { useState, useEffect } from "react";
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importa componente Link do Next.js
import Link from 'next/link';
// Importa ação para excluir produtos
import { deleteProducts } from "../../../actions/deleteProducts";
// Importa hook de notificações
import { useNotifications } from "../../../hooks/useNotifications";
// Importa componente de tabela responsiva
import ResponsiveTable from "../../../components/ResponsiveTable";
// Importa componente de botões de ação
import ActionButtons from "../../../components/ActionButtons";
// Importa componente de célula de tabela do Flowbite
import { TableCell } from "flowbite-react";

// Componente principal da tabela de produtos
export default function ProductsTable({ catalogId }) {
    // Extrai catálogos e função de atualização do contexto de ferramentas
    const { catalogs, updateCatalogs } = useTool();
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();
    // Encontra o catálogo específico
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Estado que armazena os produtos selecionados para ações em lote
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Efeito que atualiza a lista de catálogos quando o componente é montado
    useEffect(() => {
      updateCatalogs(); // Carrega os catálogos do usuário
    }, []); // Executa apenas uma vez

    // Função que alterna a seleção de um produto específico
    const toggleProductSelection = (productId) => {
      if (selectedProducts.includes(productId)) {
        // Se já está selecionado, remove da seleção
        setSelectedProducts(prevState => prevState.filter(id => id !== productId));
      } else {
        // Se não está selecionado, adiciona à seleção
        setSelectedProducts(prevState => [...prevState, productId]);
      }
    };

    // Função que seleciona/deseleciona todos os produtos
    const handleSelectAll = () => {
      if (selectedProducts.length === catalog.products.length) {
        // Se todos estão selecionados, deseleciona todos
        setSelectedProducts([]);
      } else {
        // Se nem todos estão selecionados, seleciona todos
        setSelectedProducts(catalog.products.map(product => product.id));
      }
    };

    // Função que exclui os produtos selecionados
    const handleDeleteProducts = async () => {
      notify.processing("Excluindo produtos..."); // Mostra notificação de processamento
      try {
        await deleteProducts(selectedProducts); // Executa a exclusão
        notify.productDeleted(); // Mostra notificação de sucesso
        setSelectedProducts([]); // Limpa a seleção
        updateCatalogs(); // Atualiza a lista de catálogos
      } catch (error) {
        notify.productDeletionFailed(); // Mostra notificação de erro
      }
    };

    // Função que renderiza uma linha da tabela para desktop
    const renderProductRow = (product, index) => (
      <>
        {/* Célula com nome do produto (link clicável) */}
        <TableCell className="whitespace-nowrap font-bold">
          <Link className="py-4 hover:underline" href={`/dashboard/catalogs/${catalog.id}/${product.id}`}>
            {product.name}
          </Link>
        </TableCell>
        {/* Célula com nome do catálogo */}
        <TableCell>
          {catalog.name}
        </TableCell>
        {/* Célula com preço formatado */}
        <TableCell>
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </TableCell>
        {/* Célula com data de criação formatada */}
        <TableCell>
          {new Date(product.created_at.seconds * 1000).toLocaleString()}
        </TableCell>
        {/* Célula com link para editar */}
        <TableCell>
          <Link href={`/dashboard/catalogs/${catalog.id}/${product.id}`} className="font-bold text-neonblue hover:underline">
            Editar
          </Link>
        </TableCell>
      </>
    );

    // Função que renderiza um card para mobile
    const renderProductCard = (product, index) => (
      <div className="space-y-3">
        {/* Header do card com nome e botão editar */}
        <div className="flex justify-between items-start">
          <Link className="text-lg font-bold text-prussianblue hover:underline" href={`/dashboard/catalogs/${catalog.id}/${product.id}`}>
            {product.name}
          </Link>
          <Link href={`/dashboard/catalogs/${catalog.id}/${product.id}`} className="text-sm font-bold text-neonblue hover:underline">
            Editar
          </Link>
        </div>
        
        {/* Grid com informações do produto */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Catálogo:</span>
            <p className="text-gray-800">{catalog.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Preço:</span>
            <p className="font-bold text-green-600">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
        
        {/* Data de criação */}
        <div className="text-sm">
          <span className="font-medium text-gray-600">Criado em:</span>
          <p className="text-gray-800">{new Date(product.created_at.seconds * 1000).toLocaleString()}</p>
        </div>
      </div>
    );

    // Define as colunas da tabela
    const columns = [
      { label: "Nome" },
      { label: "Catálogo" },
      { label: "Preço" },
      { label: "Data de criação" },
      { label: "Ações" }
    ];

    return (
      <>
        {/* Componente de botões de ação (criar, editar, excluir) */}
        <ActionButtons
          selectedCount={selectedProducts.length} // Quantidade de itens selecionados
          onDelete={handleDeleteProducts} // Função para excluir produtos
          onCreateHref={`/dashboard/catalogs/${catalogId}/new-product`} // Link para criar novo produto
          onEditHref={selectedProducts.length === 1 ? `/dashboard/catalogs/${catalogId}/${selectedProducts[0]}` : "#"} // Link para editar (só funciona com 1 selecionado)
          createLabel="Criar Produto" // Texto do botão criar
          editLabel="Editar Produto" // Texto do botão editar
          deleteLabel="Deletar Produtos" // Texto do botão excluir
        />
        
        {/* Tabela responsiva que exibe os produtos */}
        <ResponsiveTable
          columns={columns} // Colunas da tabela
          data={catalog.products || []} // Dados dos produtos (array vazio se não houver)
          renderRow={renderProductRow} // Função para renderizar linha da tabela
          renderMobileCard={renderProductCard} // Função para renderizar card mobile
          onSelectAll={handleSelectAll} // Função para selecionar todos
          onSelectItem={toggleProductSelection} // Função para selecionar item individual
          selectedItems={selectedProducts} // IDs dos itens selecionados
          selectable={true} // Permite seleção de itens
          emptyMessage="Você ainda não criou um produto." // Mensagem quando não há dados
        />
      </>   
    );
}