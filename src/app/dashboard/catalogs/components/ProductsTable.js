'use client'

// Importação de hooks do React
import { useState, useEffect } from "react";
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importação de componentes do Flowbite React para tabela
import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
// Importação do componente Link do Next.js
import Link from 'next/link';
// Importação de ícones
import { BiEdit } from "react-icons/bi";
import { HiPlus, HiTrash } from "react-icons/hi";
// Importação de ação do servidor para deletar produtos
import { deleteProducts } from "../../../actions/deleteProducts";
// Importação do hook personalizado para notificações
import { useNotifications } from "../../../hooks/useNotifications";
// Importação do componente ButtonAPP personalizado
import ButtonAPP from "../../../components/ButtonAPP";

/**
 * Componente de tabela para exibir e gerenciar produtos de um catálogo
 * Permite visualizar, selecionar, editar e deletar produtos
 * @param {string} catalogId - ID único do catálogo cujos produtos serão exibidos
 * @returns {JSX.Element} Tabela com lista de produtos e controles de ação
 */
export default function ProductsTable({ catalogId }) {
    // Desestruturação dos dados e funções do contexto de ferramentas
    const { catalogs, updateCatalogs } = useTool();
    // Desestruturação da função de notificação
    const { notify } = useNotifications();
    // Encontra o catálogo específico na lista de catálogos
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Estado para armazenar os produtos selecionados para operações em lote
    const [selectedProducts, setSelectedProducts] = useState([]);

    /**
     * Efeito para carregar os catálogos quando o componente é montado
     * Garante que os dados estejam atualizados na inicialização
     */
    useEffect(() => {
      updateCatalogs();  // Carrega lista de catálogos do servidor
    }, []);  // Array vazio = executa apenas na montagem

    /**
     * Função para alternar a seleção de um produto
     * Adiciona ou remove produto da lista de selecionados
     * @param {string} productId - ID único do produto
     */
    const toggleProductSelection = (productId) => {
      if (selectedProducts.includes(productId)) {
        // Se já está selecionado, remove da lista
        setSelectedProducts(prevState => prevState.filter(id => id !== productId));
      } else {
        // Se não está selecionado, adiciona à lista
        setSelectedProducts(prevState => [...prevState, productId]);
      }
    };

    /**
     * Função assíncrona para lidar com a exclusão de produtos selecionados
     * Executa a exclusão e atualiza a interface
     */
    const handleDeleteProducts = async () => {
      notify.processing("Excluindo produtos...");  // Exibe notificação de processamento
      try {
        // Chama a ação do servidor para deletar os produtos selecionados
        await deleteProducts(selectedProducts);
        notify.productDeleted();  // Exibe notificação de sucesso
        setSelectedProducts([]);  // Limpa a seleção
        updateCatalogs();  // Atualiza lista de catálogos
      } catch (error) {
        // Trata erros na exclusão
        notify.productDeletionFailed();
      }
    };

    const renderProducts = () => {
      return catalog.products.map((product, index) => (
        <TableRow key={index} className="bg-lightcyan text-prussianblue">
          <TableCell>
            <Checkbox
              checked={selectedProducts.includes(product.id)}
              onChange={() => toggleProductSelection(product.id)}
              className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
          </TableCell>
          <TableCell className="whitespace-nowrap font-bold">
            <Link className="py-4 hover:underline" href={`/dashboard/catalogs/${catalog.id}/${product.id}`}>
              {product.name}
            </Link>
          </TableCell>
          <TableCell>
            {catalog.name}
          </TableCell>
          <TableCell>
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </TableCell>
          <TableCell>
            {new Date(product.created_at.seconds * 1000).toLocaleString()}
          </TableCell>
          <TableCell>
            <Link href={`/dashboard/catalogs/${catalog.id}/${product.id}`} className="font-bold text-neonblue hover:underline">
              Editar
            </Link>
          </TableCell>
        </TableRow>
      ));
    };

    return (
      <>
        <div className="max-sm:fixed max-sm:z-10 max-sm:bottom-6 left-0 max-sm:flex max-sm:justify-center max-sm:w-full">
          <div className="flex flex-wrap items-center max-sm:flex-row max-sm:bg-lightcyan max-sm:border-jordyblue max-sm:border-4 max-sm:rounded-xl max-sm:flex max-sm:justify-around">
            {selectedProducts.length > 0 && (
              <ButtonAPP
                onClick={handleDeleteProducts}
                className="m-2 max-[344px]:px-6"
                negative>
                <HiTrash className="w-5 h-5 mr-1 max-sm:m-0"/> Deletar
              </ButtonAPP>
            )}
            <ButtonAPP
              href={`/dashboard/catalogs/${catalogId}/new-product`}
              className="m-2 max-[344px]:px-6">
              <HiPlus className="w-5 h-5 mr-1 "/> Criar
            </ButtonAPP>
            {selectedProducts.length === 1 && (
              <ButtonAPP
              href={`/dashboard/catalogs/${catalogId}/${selectedProducts[0]}`}
              className="m-2 max-[344px]:px-6">
                <BiEdit className="w-5 h-5 mr-1 max-sm:m-0"/> Editar
              </ButtonAPP>
            )}
          </div>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableHeadCell className="p-4 bg-cornflowerblue">
                {catalog.products && catalog.products.length > 0 && (
                  <Checkbox
                    checked={selectedProducts.length === catalog.products.length}
                    onChange={() => {
                      if (selectedProducts.length === catalog.products.length) {
                        setSelectedProducts([]);
                      } else {
                        setSelectedProducts(catalog.products.map(product => product.id));
                      }
                    }}
                    className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
                )}
              </TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Nome</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Catálogo</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Preço</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Data de criação</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">
                <span className="sr-only">Editar</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y !w-full">
              {catalog.products.length < 1 ? (
                <TableRow className="bg-jordyblue text-white">
                  <TableCell colSpan={6}>Você ainda não criou um produto.</TableCell>
                </TableRow>
              ) : renderProducts()}
            </TableBody>
          </Table>
        </div>
      </>   
    );
}