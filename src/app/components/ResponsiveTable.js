/**
 * COMPONENTE DE TABELA RESPONSIVA - INTERFACE ADAPTATIVA
 * 
 * Este arquivo contém um componente de tabela inteligente que se adapta
 * automaticamente ao tamanho da tela. Em dispositivos desktop, exibe uma
 * tabela tradicional com colunas e linhas. Em dispositivos móveis, converte
 * os dados em cards verticais para melhor usabilidade.
 * 
 * Funcionalidades:
 * - Detecção automática de tamanho de tela
 * - Tabela tradicional para desktop (768px+)
 * - Cards responsivos para mobile (<768px)
 * - Sistema de seleção individual e em massa
 * - Colunas totalmente customizáveis
 * - Renderização personalizada de conteúdo
 * - Mensagem personalizada para listas vazias
 * - Acessibilidade completa com checkboxes
 * - Suporte a eventos de redimensionamento
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
// Importa hook de estado do React para gerenciar estado local
import { useState } from 'react';
// Importa componentes de tabela e checkbox do Flowbite
import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';

/**
 * Componente de tabela responsiva que se adapta ao tamanho da tela
 * @param {Array} columns - Configuração das colunas da tabela
 * @param {Array} data - Dados a serem exibidos na tabela
 * @param {Function} renderRow - Função para renderizar cada linha (desktop)
 * @param {Function} renderMobileCard - Função para renderizar cada card (mobile)
 * @param {Function} onSelectAll - Callback para seleção de todos os itens
 * @param {Function} onSelectItem - Callback para seleção de item individual
 * @param {Array} selectedItems - Array com IDs dos itens selecionados
 * @param {boolean} selectable - Se permite seleção de itens
 * @param {string} emptyMessage - Mensagem quando não há dados
 * @param {string} className - Classes CSS adicionais
 */
export default function ResponsiveTable({ 
  columns, // Array de objetos com configuração das colunas
  data, // Array de dados a serem exibidos
  renderRow, // Função para renderizar cada linha da tabela (desktop)
  renderMobileCard, // Função para renderizar cada card (mobile)
  onSelectAll, // Função chamada quando seleciona todos os itens
  onSelectItem, // Função chamada quando seleciona um item individual
  selectedItems = [], // Array de IDs dos itens selecionados
  selectable = true, // Se permite seleção de itens
  emptyMessage = "Nenhum item encontrado", // Mensagem quando não há dados
  className = "" // Classes CSS adicionais
}) {
  // Estado para controlar se está em modo mobile
  const [isMobile, setIsMobile] = useState(false);

  // Efeito para detectar mudanças no tamanho da tela
  useState(() => {
    // Função que verifica se a tela é mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Considera mobile se largura < 768px
    };
    
    checkMobile(); // Verifica o tamanho inicial da tela
    window.addEventListener('resize', checkMobile); // Adiciona listener para mudanças de tamanho
    
    // Função de limpeza que remove o listener ao desmontar o componente
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verifica se todos os itens estão selecionados
  const allSelected = selectedItems.length === data.length && data.length > 0;
  // Verifica se alguns (mas não todos) itens estão selecionados
  const someSelected = selectedItems.length > 0 && selectedItems.length < data.length;

  // Se for mobile, renderiza em formato de cards
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.length === 0 ? (
          /* Mensagem de lista vazia com estilo centralizado */
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {emptyMessage}
          </div>
        ) : (
          /* Mapeia e renderiza cada item como card individual */
          data.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              {/* Checkbox de seleção se habilitado */}
              {selectable && (
                <div className="flex items-center mb-3">
                  <Checkbox
                    checked={selectedItems.includes(item.id || index)} // Verifica se está selecionado
                    onChange={() => onSelectItem(item.id || index)} // Função de seleção
                    className="text-primary-800 focus:ring-primary-200 cursor-pointer border-primary-800"
                  />
                  <span className="ml-2 text-sm text-gray-600">Selecionar</span>
                </div>
              )}
              {/* Renderiza o card personalizado usando a função fornecida */}
              {renderMobileCard(item, index)}
            </div>
          ))
        )}
      </div>
    );
  }

  // Se for desktop, renderiza como tabela tradicional
  return (
    <div className={`overflow-x-auto shadow-md rounded-lg ${className}`}>
      <Table>
        {/* Cabeçalho da tabela com estilo personalizado */}
        <TableHead>
          {/* Coluna de seleção se habilitada */}
          {selectable && (
            <TableHeadCell className="p-4 bg-primary-300">
              <Checkbox
                checked={allSelected} // Marca como checked se todos estão selecionados
                ref={(input) => {
                  if (input) input.indeterminate = someSelected; // Estado indeterminado se alguns estão selecionados
                }}
                onChange={onSelectAll} // Função para selecionar todos
                className="text-primary-800 focus:ring-primary-200 cursor-pointer border-primary-800"
              />
            </TableHeadCell>
          )}
          {/* Mapeia e renderiza cada coluna do cabeçalho */}
          {columns.map((column, index) => (
            <TableHeadCell key={index} className="bg-primary-300 text-white">
              {column.label}
            </TableHeadCell>
          ))}
        </TableHead>
        {/* Corpo da tabela com divisores entre linhas */}
        <TableBody className="divide-y">
          {data.length === 0 ? (
            /* Linha de mensagem vazia que ocupa todas as colunas */
            <TableRow className="bg-primary-200 text-white">
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            /* Mapeia e renderiza cada linha de dados */
            data.map((item, index) => (
              <TableRow key={index} className="bg-primary-50 text-primary-800">
                {/* Célula de seleção se habilitada */}
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id || index)} // Verifica se está selecionado
                      onChange={() => onSelectItem(item.id || index)} // Função de seleção
                      className="text-primary-800 focus:ring-primary-200 cursor-pointer border-primary-800"
                    />
                  </TableCell>
                )}
                {/* Renderiza a linha personalizada usando a função fornecida */}
                {renderRow(item, index)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
