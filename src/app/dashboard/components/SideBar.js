'use client'
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiChartPie,  HiMenu, HiShoppingBag, HiUser, HiViewBoards } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";
import { BiSolidCrown } from "react-icons/bi";
import Link from 'next/link';
import { FaBoxesStacked } from 'react-icons/fa6';
import SidebarItem from './SidebarItem';


export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, DBUser, logout } = useAuth()

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.sidebar') && isOpen) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSignOut = async() => {
    await logout();
  };

  return (
    <>
    <div className='max-md:px-4 max-md:fixed z-10 top-0 left-0 max-md:w-full'>
      <div className='flex items-center justify-between px-6 pt-4 max-md:py-3 max-md:mt-4 max-md:rounded-lg max-md:bg-neonblue max-md:shadow-md'>
        <button onClick={toggleSidebar} className="p-3">
          <HiMenu className='w-8 h-8 text-prussianblue max-md:text-lightcyan'/>
        </button>

        <Link href="/dashboard/account">
          <button className='flex-col leading-none bg-prussianblue max-md:bg-cornflowerblue text-lightcyan font-bold p-4 rounded-full w-12 h-12 flex items-center justify-center text-xl'>
            {DBUser ? (<>
              {DBUser.premium && <span><BiSolidCrown className='w-4 h-4 text-yellow-400'/></span>}
              {DBUser.username[0]}
            </>) : ("...")}
          </button>
        </Link>
      </div>
    </div>
    <div className='max-md:h-[120px] w-full'></div>
    <Sidebar 
    className={`${!isOpen ? 'max-lg:-translate-x-full' : 'max-md:-translate-x-0 max-sm:!w-[80%]'} !fixed !z-50 left-0 top-0 dark right-0 transition-transform duration-300 ease-in-out transform `} 
    aria-label="Sidebar with content separator example">
      <div className='absolute top-0 left-0 w-full h-full p-4 bg-prussianblue'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <SidebarItem
          text="Dashboard"
          href="/dashboard"
          icon={<HiChartPie className='text-lightcyan/80 w-6 h-6'/>}
          />
          <SidebarItem
          text="Catálogos"
          href="/dashboard/catalogs" 
          icon={<HiViewBoards className='text-lightcyan/80 w-6 h-6'/>}
          />
          <SidebarItem
          text="Pedidos"
          href="/dashboard/orders" 
          icon={<FaBoxesStacked className='text-lightcyan/80 w-6 h-6'/>}
          />
          <SidebarItem
          text="Conta"
          href="/dashboard/account" 
          icon={<HiUser className='text-lightcyan/80 w-6 h-6'/>}
          />
          <SidebarItem
          text={<p className='flex items-center'>Assinatura <FaExternalLinkAlt className='ml-1 w-3 h-3 text-gray-400'/></p>}
          href="https://billing.stripe.com/p/login/bIYeVCgog7Tl48M000" 
          target="_blank"
          icon={<HiShoppingBag className='text-lightcyan/80 w-6 h-6'/>}
          />
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
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