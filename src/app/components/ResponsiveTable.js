/**
 * COMPONENTE DE TABELA RESPONSIVA
 * 
 * Este arquivo contém um componente de tabela adaptativa que alterna entre
 * visualização de tabela tradicional (desktop) e cards (mobile). O componente
 * suporta seleção de itens, colunas customizáveis e renderização personalizada.
 * 
 * Funcionalidades:
 * - Tabela tradicional para desktop
 * - Cards para dispositivos móveis
 * - Seleção individual e em massa de itens
 * - Colunas customizáveis
 * - Renderização personalizada de linhas e cards
 * - Mensagem de lista vazia
 * - Detecção automática de tamanho de tela
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { useState } from 'react'; // Importa hook do React
import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'; // Importa componentes de tabela do Flowbite

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

  // Detecta se é mobile
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Considera mobile se largura < 768px
    };
    
    checkMobile(); // Verifica o tamanho inicial
    window.addEventListener('resize', checkMobile); // Adiciona listener para mudanças de tamanho
    
    return () => window.removeEventListener('resize', checkMobile); // Remove listener ao desmontar
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
          /* Mensagem de lista vazia */
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {emptyMessage}
          </div>
        ) : (
          /* Mapeia e renderiza cada item como card */
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
              {/* Renderiza o card personalizado */}
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
        {/* Cabeçalho da tabela */}
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
          {/* Mapeia e renderiza cada coluna */}
          {columns.map((column, index) => (
            <TableHeadCell key={index} className="bg-primary-300 text-white">
              {column.label}
            </TableHeadCell>
          ))}
        </TableHead>
        {/* Corpo da tabela */}
        <TableBody className="divide-y">
          {data.length === 0 ? (
            /* Linha de mensagem vazia */}
            <TableRow className="bg-primary-200 text-white">
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            /* Mapeia e renderiza cada linha */}
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
                {/* Renderiza a linha personalizada */}
                {renderRow(item, index)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
