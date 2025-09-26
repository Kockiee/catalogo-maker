'use client'
// Importação do componente Sidebar do Flowbite React
import { Sidebar } from 'flowbite-react';
// Importação de hooks do React para estado e efeitos
import { useEffect, useState } from 'react';
// Importação de ícones do Heroicons
import { HiChartPie,  HiMenu, HiShoppingBag, HiUser, HiViewBoards } from 'react-icons/hi';
// Importação do contexto de autenticação
import { useAuth } from '../../contexts/AuthContext';
// Importação de ícones do React Icons
import { FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";
import { BiSolidCrown } from "react-icons/bi";
// Importação do componente Link do Next.js
import Link from 'next/link';
// Importação de ícones do React Icons Fa6
import { FaBoxesStacked } from 'react-icons/fa6';
// Importação do componente personalizado SidebarItem
import SidebarItem from './SidebarItem';

/**
 * Componente de barra lateral (sidebar) do dashboard
 * Fornece navegação entre as diferentes seções da aplicação
 * Responsivo: colapsa em dispositivos móveis
 * @returns {JSX.Element} Barra lateral com itens de navegação
 */
export default function SideBar() {
  // Estado para controlar se a sidebar está aberta/fechada
  const [isOpen, setIsOpen] = useState(false);
  // Desestruturação das funções e dados do contexto de autenticação
  const { user, DBUser, logout } = useAuth()

  /**
   * Função para alternar o estado de abertura da sidebar
   * Usada pelo botão de menu hambúrguer
   */
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Efeito para lidar com cliques fora da sidebar
   * Fecha a sidebar automaticamente quando o usuário clica fora dela em dispositivos móveis
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Verifica se o clique foi fora da sidebar e se ela está aberta
      if (!event.target.closest('.sidebar') && isOpen) {
        setIsOpen(false);  // Fecha a sidebar
      }
    };

    // Adiciona o listener de clique ao body
    document.body.addEventListener('click', handleOutsideClick);

    // Função de cleanup: remove o listener quando o componente é desmontado
    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);  // Dependência: executa novamente se isOpen mudar

  /**
   * Função para lidar com o logout do usuário
   * Executa a função de logout do contexto de autenticação
   */
  const handleSignOut = async() => {
    await logout();  // Chama a função de logout do contexto
  };

  // Renderiza a estrutura da sidebar
  return (
    <>
    {/* Cabeçalho da sidebar - fixo em dispositivos móveis */}
    <div className='max-md:px-4 max-md:fixed z-10 top-0 left-0 max-md:w-full'>
      <div className='flex items-center justify-between px-6 pt-4 max-md:py-3 max-md:mt-4 max-md:rounded-lg max-md:bg-neonblue max-md:shadow-md'>
        {/* Botão para abrir/fechar a sidebar */}
        <button onClick={toggleSidebar} className="p-3">
          <HiMenu className='w-8 h-8 text-prussianblue max-md:text-lightcyan'/>
        </button>

        {/* Avatar do usuário - redireciona para página de conta */}
        <Link href="/dashboard/account">
          <button className='flex-col leading-none bg-prussianblue max-md:bg-cornflowerblue text-lightcyan font-bold p-4 rounded-full w-12 h-12 flex items-center justify-center text-xl'>
            {DBUser ? (<>
              {/* Ícone de coroa dourada se usuário for premium */}
              {DBUser.premium && <span><BiSolidCrown className='w-4 h-4 text-yellow-400'/></span>}
              {DBUser.username[0]}  {/* Primeira letra do nome do usuário */}
            </>) : ("...")}  {/* Placeholder enquanto carrega */}
          </button>
        </Link>
      </div>
    </div>
    {/* Espaçamento para compensar o cabeçalho fixo em dispositivos móveis */}
    <div className='max-md:h-[120px] w-full'></div>
    {/* Sidebar principal com navegação */}
    <Sidebar
    className={`${!isOpen ? 'max-lg:-translate-x-full' : 'max-md:-translate-x-0 max-sm:!w-[80%]'} !fixed !z-50 left-0 top-0 dark right-0 transition-transform duration-300 ease-in-out transform `}
    aria-label="Sidebar with content separator example">
      <div className='absolute top-0 left-0 w-full h-full p-4 bg-prussianblue'>
      <Sidebar.Items>
        {/* Grupo principal de itens de navegação */}
        <Sidebar.ItemGroup>
          {/* Item: Dashboard - página inicial */}
          <SidebarItem
          text="Dashboard"
          href="/dashboard"
          icon={<HiChartPie className='text-lightcyan/80 w-6 h-6'/>}
          />
          {/* Item: Catálogos - gerenciar catálogos */}
          <SidebarItem
          text="Catálogos"
          href="/dashboard/catalogs"
          icon={<HiViewBoards className='text-lightcyan/80 w-6 h-6'/>}
          />
          {/* Item: Pedidos - gerenciar pedidos */}
          <SidebarItem
          text="Pedidos"
          href="/dashboard/orders"
          icon={<FaBoxesStacked className='text-lightcyan/80 w-6 h-6'/>}
          />
          {/* Item: Conta - configurações da conta */}
          <SidebarItem
          text="Conta"
          href="/dashboard/account"
          icon={<HiUser className='text-lightcyan/80 w-6 h-6'/>}
          />
          {/* Item: Assinatura - link externo para gerenciar assinatura no Stripe */}
          <SidebarItem
          text={<p className='flex items-center'>Assinatura <FaExternalLinkAlt className='ml-1 w-3 h-3 text-gray-400'/></p>}
          href="https://billing.stripe.com/p/login/bIYeVCgog7Tl48M000"
          target="_blank"
          icon={<HiShoppingBag className='text-lightcyan/80 w-6 h-6'/>}
          />
        </Sidebar.ItemGroup>
        {/* Grupo secundário - apenas logout */}
        <Sidebar.ItemGroup>
          {/* Item: Logout - só aparece se usuário estiver logado */}
          {user && (
            <Sidebar.Item
            icon={() => <FaSignOutAlt className='text-lightcyan/80 w-6 h-6'/>}
            onClick={handleSignOut}
            className="!text-red-300 duration-100 hover:cursor-pointer hover:!bg-neonblue/70">
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