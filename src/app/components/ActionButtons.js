/**
 * COMPONENTE DE BOTÕES DE AÇÃO
 * 
 * Este arquivo contém um componente responsivo que exibe botões de ação (criar, editar, deletar)
 * para gerenciar itens em listas. O componente se adapta automaticamente entre desktop e mobile,
 * mostrando uma interface otimizada para cada tipo de dispositivo.
 * 
 * Funcionalidades:
 * - Botões de criar, editar e deletar
 * - Interface responsiva (diferente para mobile e desktop)
 * - Controle de visibilidade baseado em seleções
 * - Suporte a links de navegação
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { useState, useEffect } from 'react'; // Importa hooks do React para gerenciar estado e efeitos
import Link from 'next/link'; // Importa componente de link do Next.js para navegação
import { BiEdit } from "react-icons/bi"; // Importa ícone de edição
import { HiPlus, HiTrash } from "react-icons/hi"; // Importa ícones de adicionar e deletar
import ButtonAPP from './ButtonAPP'; // Importa o componente de botão personalizado

export default function ActionButtons({ 
  selectedCount = 0, // Número de itens selecionados
  onDelete, // Função chamada quando o botão deletar é clicado
  onCreateHref, // URL para a página de criação
  onEditHref, // URL para a página de edição
  createLabel = "Criar", // Texto do botão de criar
  editLabel = "Editar", // Texto do botão de editar
  deleteLabel = "Deletar", // Texto do botão de deletar
  showCreate = true, // Se deve mostrar o botão de criar
  showEdit = true, // Se deve mostrar o botão de editar
  showDelete = true, // Se deve mostrar o botão de deletar
  className = "" // Classes CSS adicionais
}) {
  // Estado para detectar se está em dispositivo mobile
  const [isMobile, setIsMobile] = useState(false);

  // Efeito para detectar mudanças no tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Considera mobile se largura < 768px
    };
    
    checkMobile(); // Verifica o tamanho inicial
    window.addEventListener('resize', checkMobile); // Adiciona listener para mudanças de tamanho
    
    return () => window.removeEventListener('resize', checkMobile); // Remove listener ao desmontar
  }, []);

  // Se for mobile, renderiza interface otimizada para mobile
  if (isMobile) {
    return (
      <div className={`fixed bottom-6 left-0 z-50 flex justify-center w-full ${className}`}>
        <div className="flex flex-row bg-primary-50 border-primary-200 border-4 rounded-xl justify-around shadow-lg px-4 py-2">
          {/* Botão de deletar - só aparece se há itens selecionados */}
          {selectedCount > 0 && showDelete && (
            <ButtonAPP
              onClick={onDelete} // Chama função de deletar
              className="px-4 py-2"
              negative // Aplica estilo de botão negativo (vermelho)
            >
              <HiTrash className="w-4 h-4 mr-1" /> {/* Ícone de lixeira */}
              <span className="hidden sm:inline">{deleteLabel}</span> {/* Texto visível apenas em telas maiores */}
            </ButtonAPP>
          )}
          
          {/* Botão de criar - sempre visível se habilitado */}
          {showCreate && (
            <Link href={onCreateHref}> {/* Link para página de criação */}
              <ButtonAPP className="px-4 py-2">
                <HiPlus className="w-4 h-4 mr-1" /> {/* Ícone de adicionar */}
                <span className="hidden sm:inline">{createLabel}</span> {/* Texto visível apenas em telas maiores */}
              </ButtonAPP>
            </Link>
          )}
          
          {/* Botão de editar - só aparece se exatamente 1 item está selecionado */}
          {selectedCount === 1 && showEdit && (
            <Link href={onEditHref}> {/* Link para página de edição */}
              <ButtonAPP className="px-4 py-2">
                <BiEdit className="w-4 h-4 mr-1" /> {/* Ícone de editar */}
                <span className="hidden sm:inline">{editLabel}</span> {/* Texto visível apenas em telas maiores */}
              </ButtonAPP>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Interface para desktop - botões em linha horizontal
  return (
    <div className={`flex flex-wrap items-center space-x-2 ${className}`}>
      {/* Botão de deletar - só aparece se há itens selecionados */}
      {selectedCount > 0 && showDelete && (
        <ButtonAPP
          onClick={onDelete} // Chama função de deletar
          className="m-2"
          negative // Aplica estilo de botão negativo (vermelho)
        >
          <HiTrash className="w-5 h-5 mr-1" /> {/* Ícone de lixeira */}
          {deleteLabel} {/* Texto do botão */}
        </ButtonAPP>
      )}
      
      {/* Botão de criar - sempre visível se habilitado */}
      {showCreate && (
        <Link href={onCreateHref}> {/* Link para página de criação */}
          <ButtonAPP className="m-2">
            <HiPlus className="w-5 h-5 mr-1" /> {/* Ícone de adicionar */}
            {createLabel} {/* Texto do botão */}
          </ButtonAPP>
        </Link>
      )}
      
      {/* Botão de editar - só aparece se exatamente 1 item está selecionado */}
      {selectedCount === 1 && showEdit && (
        <Link href={onEditHref}> {/* Link para página de edição */}
          <ButtonAPP className="m-2">
            <BiEdit className="w-5 h-5 mr-1" /> {/* Ícone de editar */}
            {editLabel} {/* Texto do botão */}
          </ButtonAPP>
        </Link>
      )}
    </div>
  );
}
