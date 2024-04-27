'use client'
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const pathname = usePathname()
    return (
        <>
        {!pathname.includes("dashboard") && (
            <Navbar className='bg-transparent max-md:bg-periwinkle !p-6' fluid>
                <NavbarBrand href="/">
                    <Image src="/logo.png" width={48} height={48}/>
                    <span className="text-prussianblue max-[306px]:hidden self-center whitespace-nowrap text-xl font-bold dark:text-white pl-2">Catálogo Maker</span>
                </NavbarBrand>
                <div className="flex md:order-2 space-x-2">
                    <Link href="/auth/signin">
                        <Button
                        className='max-sm:hidden !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-jordyblue'>
                            Entrar
                        </Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button
                        className='max-sm:hidden !bg-neonblue !border-4 !border-jordyblue text-lightcyan hover:!bg-neonblue/90 focus:!ring-0'>
                            Criar Conta
                        </Button>
                    </Link>
                    <NavbarToggle />
                </div>
                <NavbarCollapse>
                    <NavbarLink className='!text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/">Início</NavbarLink>
                    <NavbarLink className='!text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/mobile">Baixar</NavbarLink>
                    <NavbarLink className='!text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/#prices">Preços</NavbarLink>
                    <NavbarLink className='!text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/about">Sobre Nós</NavbarLink>
                    <div className='hidden max-sm:flex max-sm:flex-col mt-3 space-y-2'>
                        <Link href="/auth/signin" className='w-full'>
                            <Button 
                            className='w-full !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-0'>
                                Entrar
                            </Button>
                        </Link>
                        <Link href="/auth/signup" className='w-full'>
                            <Button 
                            className='w-full !bg-neonblue !border-4 !border-jordyblue text-lightcyan hover:!bg-neonblue/90 focus:!ring-0'>
                                Criar Conta
                            </Button>
                        </Link>
                    </div>
                </NavbarCollapse>
            </Navbar>
        )}
        </>
    )
}