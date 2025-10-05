/**
 * COMPONENTE DE BARRA DE NAVEGAÇÃO
 * 
 * Este arquivo contém o componente de navbar do Catálogo Maker que exibe
 * o logo, links de navegação e botões de autenticação. O componente é
 * responsivo e se adapta a diferentes tamanhos de tela.
 * 
 * Funcionalidades:
 * - Logo e nome da empresa
 * - Links de navegação (Início, Preços, Sobre Nós)
 * - Botões de autenticação (Entrar, Criar Conta)
 * - Design responsivo com menu mobile
 * - Ocultação automática no dashboard
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'; // Importa componentes do Flowbite
import Image from 'next/image' // Importa componente Image otimizado do Next.js
import Link from 'next/link'; // Importa componente Link do Next.js
import { usePathname } from 'next/navigation'; // Importa hook para obter o caminho atual

export default function NavBar() {
    // Obtém o caminho atual da página
    const pathname = usePathname()
    return (
        <>
        {/* Só renderiza a navbar se não estiver na página do dashboard */}
        {!pathname.includes("dashboard") && (
            <Navbar className='bg-transparent max-md:bg-periwinkle !p-6' fluid>
                {/* Logo e nome da empresa */}
                <NavbarBrand href="/">
                    <Image alt="Catálogo Maker" src="/logo.png" width={48} height={48}/> {/* Logo da empresa */}
                    <span className="text-prussianblue max-[306px]:hidden self-center whitespace-nowrap text-xl font-bold dark:text-white pl-2">Catálogo Maker</span> {/* Nome da empresa */}
                </NavbarBrand>
                {/* Área de botões e toggle mobile */}
                <div className="flex md:order-2 space-x-2">
                    {/* Botão de entrar (visível apenas em telas maiores) */}
                    <Link href="/auth/signin">
                        <Button
                        size='md'
                        className='max-sm:hidden !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-jordyblue h-full'>
                            Entrar
                        </Button>
                    </Link>
                    {/* Botão de criar conta (visível apenas em telas maiores) */}
                    <Link href="/auth/signup">
                        <Button
                        size='md'
                        className='max-sm:hidden !bg-neonblue !border-4 !border-jordyblue text-lightcyan hover:!bg-neonblue/90 focus:!ring-0'>
                            Criar Conta
                        </Button>
                    </Link>
                    {/* Toggle para menu mobile */}
                    <NavbarToggle />
                </div>
                {/* Menu de navegação */}
                <NavbarCollapse>
                    {/* Link para página inicial */}
                    <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/">Início</NavbarLink>
                    {/* Link comentado para download mobile */}
                    {/* <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/mobile">Baixar</NavbarLink> */}
                    {/* Link para seção de preços */}
                    <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/#prices">Preços</NavbarLink>
                    {/* Link para página sobre */}
                    <NavbarLink className='duration-300 hover:scale-110 !text-prussianblue hover:!text-prussianblue/80 active:!text-prussianblue font-bold' href="/about">Sobre Nós</NavbarLink>
                    {/* Botões de autenticação para mobile */}
                    <div className='hidden max-sm:flex max-sm:flex-col mt-3 space-y-2'>
                        {/* Botão de entrar para mobile */}
                        <Link href="/auth/signin" className='w-full'>
                            <Button 
                            className='w-full !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-0'>
                                Entrar
                            </Button>
                        </Link>
                        {/* Botão de criar conta para mobile */}
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