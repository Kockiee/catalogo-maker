'use client' // Diretiva para indicar que este código executa no cliente

// Importação de componentes do Flowbite React para construção da barra de navegação
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
// Importação do componente Image do Next.js para otimização de imagens
import Image from 'next/image'
// Importação do componente Link do Next.js para navegação entre páginas
import Link from 'next/link';
// Importação do hook usePathname para obter o caminho atual da URL
import { usePathname } from 'next/navigation';

// Componente de barra de navegação principal da aplicação
export default function NavBar() {
    // Obtém o caminho atual da URL para renderização condicional
    const pathname = usePathname()
    return (
        <>
        {/* Renderiza a barra de navegação apenas quando não estiver na área de dashboard */}
        {!pathname.includes("dashboard") && (
            <Navbar className='bg-transparent max-md:bg-periwinkle !p-6' fluid>
                {/* Logo e nome da aplicação */}
                <NavbarBrand href="/">
                    <Image alt="Catálogo Maker" src="/logo.png" width={48} height={48}/>
                    <span className="text-prussianblue max-[306px]:hidden self-center whitespace-nowrap text-xl font-bold dark:text-white pl-2">Catálogo Maker</span>
                </NavbarBrand>
                {/* Área de botões de autenticação e toggle para menu mobile */}
                <div className="flex md:order-2 space-x-2">
                    {/* Botão de login visível apenas em telas maiores que sm */}
                    <Link href="/auth/signin">
                        <Button
                        size='md'
                        className='max-sm:hidden !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-jordyblue h-full'>
                            Entrar
                        </Button>
                    </Link>
                    {/* Botão de cadastro visível apenas em telas maiores que sm */}
                    <Link href="/auth/signup">
                        <Button
                        size='md'
                        className='max-sm:hidden !bg-neonblue !border-4 !border-jordyblue text-lightcyan hover:!bg-neonblue/90 focus:!ring-0'>
                            Criar Conta
                        </Button>
                    </Link>
                    {/* Botão de toggle para menu mobile */}
                    <NavbarToggle />
                </div>
                {/* Links de navegação que aparecem no menu colapsável */}
                <NavbarCollapse>
                    <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/">Início</NavbarLink>
                    {/* Link para download do app mobile (comentado) */}
                    {/* <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/mobile">Baixar</NavbarLink> */}
                    <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/#prices">Preços</NavbarLink>
                    <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/about">Sobre Nós</NavbarLink>
                    {/* Botões de autenticação para telas mobile (visíveis apenas em telas menores que sm) */}
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