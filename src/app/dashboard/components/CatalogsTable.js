'use client'
// Importação de hooks do React
import { useState, useEffect } from "react";
// Importação da ação do servidor para deletar catálogos
import { deleteCatalogs } from "@/app/actions/deleteCatalogs";
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importação de componentes do Flowbite React para tabela
import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from 'flowbite-react';
// Importação do componente Link do Next.js
import Link from 'next/link';
// Importação de ícones
import { BiEdit } from "react-icons/bi";
import { HiPlus, HiTrash } from "react-icons/hi";
// Importação do hook personalizado para notificações
import { useNotifications } from "../../hooks/useNotifications";
// Importação do contexto de autenticação
import { useAuth } from "../../contexts/AuthContext";
// Importação do componente ButtonAPP personalizado
import ButtonAPP from "../../components/ButtonAPP";

/**
 * Componente de tabela para exibir e gerenciar catálogos do usuário
 * Permite visualizar, selecionar, editar e deletar catálogos
 * @returns {JSX.Element} Tabela com lista de catálogos e controles
 */
export default function CatalogsTable() {
    // Desestruturação dos dados do contexto de autenticação
    const { user } = useAuth();
    // Desestruturação dos dados e funções do contexto de ferramentas
    const { catalogs, updateCatalogs } = useTool();
    // Estado para armazenar os catálogos selecionados para operações em lote
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    // Desestruturação da função de notificação
    const { notify } = useNotifications();

    /**
     * Efeito para carregar os catálogos quando o componente é montado
     * Garante que os dados estejam atualizados na inicialização
     */
    useEffect(() => {
      updateCatalogs();  // Carrega lista de catálogos do servidor
    }, []);  // Array vazio = executa apenas na montagem

    /**
     * Função para alternar a seleção de um catálogo
     * Adiciona ou remove catálogo da lista de selecionados
     * @param {string} catalogId - ID único do catálogo
     * @param {string} whatsappSession - ID da sessão do WhatsApp do catálogo
     */
    const toggleCatalogSelection = (catalogId, whatsappSession) => {
      console.log(selectedCatalogs)  // Log para debug dos catálogos selecionados
      // Encontra o índice do catálogo selecionado (considerando ID e sessão do WhatsApp)
      const selectedIndex = selectedCatalogs.findIndex(cat => cat.id === catalogId && cat.whatsapp_session === whatsappSession);

      if (selectedIndex !== -1) {
        // Se já está selecionado, remove da lista
        const updatedSelectedCatalogs = [...selectedCatalogs];
        updatedSelectedCatalogs.splice(selectedIndex, 1);
        setSelectedCatalogs(updatedSelectedCatalogs);
      } else {
        // Se não está selecionado, adiciona à lista
        setSelectedCatalogs(prevState => [...prevState, { id: catalogId, whatsapp_session: whatsappSession }]);
      }
    };

    /**
     * Função assíncrona para lidar com a exclusão de catálogos selecionados
     * Executa a exclusão e atualiza a interface
     */
    const handleDeleteCatalogs = async () => {
      notify.processing("Excluindo catálogos...");  // Exibe notificação de processamento
      // Chama a ação do servidor para deletar os catálogos selecionados
      await deleteCatalogs(selectedCatalogs, user.uid);
      notify.catalogDeleted();  // Exibe notificação de sucesso
      setSelectedCatalogs([]);  // Limpa a seleção
      updateCatalogs();  // Atualiza lista de catálogos
    };

    /**
     * Função para renderizar as linhas da tabela com os catálogos
     * Mapeia cada catálogo para uma linha da tabela com todas as informações
     * @returns {Array<JSX.Element>} Array de linhas da tabela
     */
    const renderCatalogs = () => {
      return catalogs?.map((catalog, index) => (
        <TableRow key={index} className="bg-lightcyan text-prussianblue">
          {/* Coluna de checkbox para seleção */}
          <TableCell>
            <Checkbox
              checked={selectedCatalogs.some(cat => cat.id === catalog.id && cat.whatsapp_session === catalog.whatsapp_session)}
              onChange={() => toggleCatalogSelection(catalog.id, catalog.whatsapp_session)}
              className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
          </TableCell>
          {/* Coluna com nome do catálogo (link clicável) */}
          <TableCell className="whitespace-nowrap font-bold">
            <Link className="py-4 hover:underline" href={`/dashboard/catalogs/${catalog.id}`}>
              {catalog.name}  {/* Nome de identificação do catálogo */}
            </Link>
          </TableCell>
          {/* Coluna com nome da loja */}
          <TableCell>
            {catalog.store_name}  {/* Nome da loja do catálogo */}
          </TableCell>
          {/* Coluna com quantidade de produtos */}
          <TableCell>
            {catalog.products.length}  {/* Número de produtos no catálogo */}
          </TableCell>
          {/* Coluna com data de criação */}
          <TableCell>
            {new Date(catalog.created_at.seconds * 1000).toLocaleString()}  {/* Data formatada */}
          </TableCell>
          {/* Coluna com link para editar */}
          <TableCell>
            <Link href={`/dashboard/catalogs/${catalog.id}`} className="font-bold text-neonblue hover:underline">
              Editar  {/* Link para página de edição */}
            </Link>
          </TableCell>
        </TableRow>
      ));
    };

    return (
      <>
        <div className="max-sm:fixed max-sm:z-10 max-sm:bottom-6 left-0 max-sm:flex max-sm:justify-center max-sm:w-full">
          <div className="flex flex-wrap items-center max-sm:flex-row max-sm:bg-lightcyan max-sm:border-jordyblue max-sm:border-4 max-sm:rounded-xl max-sm:flex max-sm:justify-around">
            {selectedCatalogs.length > 0 && (
              <ButtonAPP
                onClick={handleDeleteCatalogs}
                className="m-2 max-[344px]:px-6"
                negative>
                <HiTrash className="w-5 h-5 mr-1 max-sm:m-0"/> Deletar
              </ButtonAPP>
            )}
            <Link href="/dashboard/catalogs/new-catalog">
              <ButtonAPP
                className="m-2 max-[344px]:px-6"
              >
                <HiPlus className="w-5 h-5 mr-1"/> Criar
              </ButtonAPP>
            </Link>
            {selectedCatalogs.length === 1 && (
              <ButtonAPP href={`/dashboard/catalogs/${selectedCatalogs[0].id}`} className="m-2 max-[344px]:px-6">
                <BiEdit className="w-5 h-5 mr-1 max-sm:m-0"/> Editar
              </ButtonAPP>
            )}
          </div>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableHeadCell className="p-4 bg-cornflowerblue">
                {catalogs !== null && (
                  <Checkbox
                    checked={selectedCatalogs.length === catalogs.length}
                    onChange={() => {
                      if (selectedCatalogs.length === catalogs.length) {
                        setSelectedCatalogs([]);
                      } else {
                        setSelectedCatalogs(catalogs.map(catalog => ({ id: catalog.id, whatsapp_session: catalog.whatsapp_session })));
                      }
                    }}
                    className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
                )}
              </TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Nome</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Loja</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Qtd. de Produtos</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Data de criação</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">
                <span className="sr-only">Editar</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y !w-full">
              {catalogs === null ? (
                <TableRow className="bg-jordyblue text-white">
                  <TableCell colSpan={6}>Você ainda não criou um catálogo.</TableCell>
                </TableRow>
              ) : renderCatalogs()}
            </TableBody>
          </Table>
        </div>
      </>   
    );
}

