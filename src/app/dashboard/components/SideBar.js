/**
 * Componente de barra lateral (sidebar) do dashboard
 * 
 * Este arquivo contém o componente de navegação lateral do dashboard,
 * que exibe o menu de navegação, informações do usuário e opções
 * de logout. É responsivo e se adapta a diferentes tamanhos de tela.
 * 
 * Funcionalidades principais:
 * - Menu de navegação com links para diferentes seções
 * - Informações do usuário com indicador premium
 * - Botão de logout
 * - Responsividade para mobile e desktop
 * - Controle de abertura/fechamento da sidebar
 */

'use client'
// Importa componente Sidebar do Flowbite
import { Sidebar } from 'flowbite-react';
// Importa hooks do React para estado e efeitos
import { useEffect, useState } from 'react';
// Importa ícones do Heroicons
import { HiChartPie,  HiMenu, HiShoppingBag, HiUser, HiViewBoards } from 'react-icons/hi';
// Importa contexto de autenticação
import { useAuth } from '../../contexts/AuthContext';
// Importa ícones do Font Awesome
import { FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";
// Importa ícone de coroa para usuários premium
import { BiSolidCrown } from "react-icons/bi";
// Importa componente Link do Next.js
import Link from 'next/link';
// Importa ícone de caixas empilhadas
import { FaBoxesStacked } from 'react-icons/fa6';
// Importa componente personalizado de item da sidebar
import SidebarItem from './SidebarItem';


// Componente principal da sidebar
export default function SideBar({ onToggle }) {
  // Estado que controla se a sidebar está aberta ou fechada
  const [isOpen, setIsOpen] = useState(false);
  // Extrai dados do usuário e função de logout do contexto de autenticação
  const { user, DBUser, logout } = useAuth()

  // Função que alterna o estado da sidebar
  const toggleSidebar = () => {
    const newState = !isOpen; // Inverte o estado atual
    setIsOpen(newState); // Atualiza o estado local
    if (onToggle) {
      onToggle(newState); // Notifica o componente pai sobre a mudança
    }
  };

  // Efeito que gerencia o fechamento da sidebar ao clicar fora dela
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Se clicou fora da sidebar e ela está aberta, fecha ela
      if (!event.target.closest('.sidebar') && isOpen) {
        setIsOpen(false);
        if (onToggle) {
          onToggle(false); // Notifica o componente pai
        }
      }
    };

    // Adiciona listener para cliques no documento
    document.body.addEventListener('click', handleOutsideClick);

    // Cleanup: remove o listener quando o componente é desmontado
    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onToggle]); // Executa quando isOpen ou onToggle mudam

  // Função que executa o logout do usuário
  const handleSignOut = async() => {
    await logout(); // Chama a função de logout do contexto
  };

  return (
    <>
    {/* Header responsivo com botão de menu e avatar do usuário */}
    <div className='max-lg:px-4 max-lg:fixed z-sticky top-0 left-0 max-lg:w-full'>
      <div className='flex items-center justify-between px-6 pt-4 max-lg:py-3 max-lg:mt-4 max-lg:rounded-lg max-lg:bg-primary-400 max-lg:shadow-md'>
        {/* Botão de menu para abrir/fechar sidebar */}
        <button onClick={toggleSidebar} className="p-3">
          <HiMenu className='w-8 h-8 text-primary-800 max-lg:text-primary-50'/>
        </button>

        {/* Link para página de conta com avatar do usuário */}
        <Link href="/dashboard/account">
          <button className='flex-col leading-none bg-primary-800 max-lg:bg-primary-300 text-primary-50 font-bold p-4 rounded-full w-12 h-12 flex items-center justify-center text-xl'>
            {DBUser ? (<>
              {/* Mostra coroa se usuário for premium */}
              {DBUser.premium && <span><BiSolidCrown className='w-4 h-4 text-yellow-400'/></span>}
              {/* Mostra primeira letra do username */}
              {DBUser.username[0]}
            </>) : ("...")}
          </button>
        </Link>
      </div>
    </div>
    {/* Espaçamento para mobile */}
    <div className='max-lg:h-[120px] w-full'></div>
    {/* Sidebar principal com navegação */}
    <Sidebar 
    className={`
      ${!isOpen ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-0'} 
      !fixed !z-modal left-0 top-0 h-full w-80 max-lg:w-72 max-sm:w-80
      transition-transform duration-300 ease-in-out transform
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `} 
    aria-label="Sidebar with content separator example">
      <div className='absolute top-0 left-0 w-full h-full p-4 bg-primary-800'>
      <Sidebar.Items>
        {/* Grupo de itens de navegação principal */}
        <Sidebar.ItemGroup>
          {/* Link para Dashboard */}
          <SidebarItem
          text="Dashboard"
          href="/dashboard"
          icon={<HiChartPie className='text-primary-50/80 w-6 h-6'/>}
          />
          {/* Link para Catálogos */}
          <SidebarItem
          text="Catálogos"
          href="/dashboard/catalogs" 
          icon={<HiViewBoards className='text-primary-50/80 w-6 h-6'/>}
          />
          {/* Link para Pedidos */}
          <SidebarItem
          text="Pedidos"
          href="/dashboard/orders" 
          icon={<FaBoxesStacked className='text-primary-50/80 w-6 h-6'/>}
          />
          {/* Link para Conta */}
          <SidebarItem
          text="Conta"
          href="/dashboard/account" 
          icon={<HiUser className='text-primary-50/80 w-6 h-6'/>}
          />
          {/* Link externo para Assinatura */}
          <SidebarItem
          text={<p className='flex items-center'>Assinatura <FaExternalLinkAlt className='ml-1 w-3 h-3 text-gray-400'/></p>}
          href={process.env.NEXT_PUBLIC_STRIPE_TEST_BILLING_PORTAL_URL} 
          target="_blank"
          icon={<HiShoppingBag className='text-primary-50/80 w-6 h-6'/>}
          />
        </Sidebar.ItemGroup>
        {/* Grupo de itens secundários (logout) */}
        <Sidebar.ItemGroup>
          {user && (
            <Sidebar.Item 
            icon={() => <FaSignOutAlt className='text-primary-50/80 w-6 h-6'/>} 
            onClick={handleSignOut} 
            className="!text-error duration-100 hover:cursor-pointer hover:!bg-primary-900">
              Sair da conta
            </Sidebar.Item>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      </div>
    </Sidebar>
    </>
  );
};