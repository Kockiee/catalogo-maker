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


export default function SideBar({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, DBUser, logout } = useAuth()

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.sidebar') && isOpen) {
        setIsOpen(false);
        if (onToggle) {
          onToggle(false);
        }
      }
    };

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onToggle]);

  const handleSignOut = async() => {
    await logout();
  };

  return (
    <>
    <div className='max-lg:px-4 max-lg:fixed z-sticky top-0 left-0 max-lg:w-full'>
      <div className='flex items-center justify-between px-6 pt-4 max-lg:py-3 max-lg:mt-4 max-lg:rounded-lg max-lg:bg-primary-400 max-lg:shadow-md'>
        <button onClick={toggleSidebar} className="p-3">
          <HiMenu className='w-8 h-8 text-primary-800 max-lg:text-primary-50'/>
        </button>

        <Link href="/dashboard/account">
          <button className='flex-col leading-none bg-primary-800 max-lg:bg-primary-300 text-primary-50 font-bold p-4 rounded-full w-12 h-12 flex items-center justify-center text-xl'>
            {DBUser ? (<>
              {DBUser.premium && <span><BiSolidCrown className='w-4 h-4 text-yellow-400'/></span>}
              {DBUser.username[0]}
            </>) : ("...")}
          </button>
        </Link>
      </div>
    </div>
    <div className='max-lg:h-[120px] w-full'></div>
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
        <Sidebar.ItemGroup>
          <SidebarItem
          text="Dashboard"
          href="/dashboard"
          icon={<HiChartPie className='text-primary-50/80 w-6 h-6'/>}
          />
          <SidebarItem
          text="Catálogos"
          href="/dashboard/catalogs" 
          icon={<HiViewBoards className='text-primary-50/80 w-6 h-6'/>}
          />
          <SidebarItem
          text="Pedidos"
          href="/dashboard/orders" 
          icon={<FaBoxesStacked className='text-primary-50/80 w-6 h-6'/>}
          />
          <SidebarItem
          text="Conta"
          href="/dashboard/account" 
          icon={<HiUser className='text-primary-50/80 w-6 h-6'/>}
          />
          <SidebarItem
          text={<p className='flex items-center'>Assinatura <FaExternalLinkAlt className='ml-1 w-3 h-3 text-gray-400'/></p>}
          href="https://billing.stripe.com/p/login/bIYeVCgog7Tl48M000" 
          target="_blank"
          icon={<HiShoppingBag className='text-primary-50/80 w-6 h-6'/>}
          />
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          {user && (
            <Sidebar.Item 
            icon={() => <FaSignOutAlt className='text-primary-50/80 w-6 h-6'/>} 
            onClick={handleSignOut} 
            className="!text-error/80 duration-100 hover:cursor-pointer hover:!bg-primary-400/70">
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