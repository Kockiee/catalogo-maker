'use client'
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiChartPie, HiInbox, HiMenu, HiShoppingBag, HiUser, HiViewBoards } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt } from "react-icons/fa";
import { BiSolidCrown } from "react-icons/bi";
import Link from 'next/link';


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
    <div className='flex justify-between px-6 pt-4 max-md:absolute top-0 left-0 max-md:w-full'>
      <button onClick={toggleSidebar} className="p-3">
        <HiMenu className='w-8 h-8 text-prussianblue'/>
      </button>
      
      <Link href="/dashboard/account">
        <button className='flex-col leading-none space bg-prussianblue text-lightcyan p-4 rounded-full w-12 h-12 flex items-center justify-center text-xl'>
          {DBUser ? (<>
            {DBUser.premium && <span><BiSolidCrown className='w-4 h-4 text-yellow-400'/></span>}
            {DBUser.username[0]}
          </>) : ("...")}
        </button>
      </Link>
    </div>
    <div className='max-md:h-[90px] w-full'></div>
    <Sidebar className={`${!isOpen ? 'max-lg:-translate-x-full' : 'max-md:-translate-x-0 max-sm:!w-[80%]'} !fixed !z-50 left-0 top-0 dark right-0 transition-transform duration-300 ease-in-out transform `} aria-label="Sidebar with content separator example">
      <div className='absolute top-0 left-0 w-full h-full p-4 bg-prussianblue'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link href="/dashboard">
            <Sidebar.Item icon={HiChartPie} className="hover:!bg-neonblue/70 !text-white py-3">
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link href="/dashboard/catalogs">
            <Sidebar.Item icon={HiViewBoards} className="hover:!bg-neonblue/70 !text-white py-3">
              Catálogos
            </Sidebar.Item>
          </Link>
          <Link href="/dashboard/orders">
            <Sidebar.Item icon={HiInbox} className="hover:!bg-neonblue/70 !text-white py-3">
              Pedidos
            </Sidebar.Item>
          </Link>
          <Link href="/dashboard/account">
            <Sidebar.Item icon={HiUser} className="hover:!bg-neonblue/70 !text-white py-3">
              Conta
            </Sidebar.Item>
          </Link>
          <Sidebar.Item 
          href="https://billing.stripe.com/p/login/bIYeVCgog7Tl48M000" 
          icon={HiShoppingBag} 
          className="hover:!bg-neonblue/70 !text-white py-3">
            Assinatura
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          {user && (
            <Sidebar.Item 
            icon={FaSignOutAlt} 
            onClick={handleSignOut} 
            className="!text-red-400 hover:cursor-pointer hover:!bg-neonblue/70">
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