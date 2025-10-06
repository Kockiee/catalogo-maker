/**
 * BARRA DE NAVEGAÇÃO DO CATÁLOGO
 * 
 * Este arquivo contém o componente da barra de navegação do catálogo,
 * que inclui o nome da loja, campo de pesquisa e botão do carrinho.
 * É responsiva e se adapta a diferentes tamanhos de tela.
 * 
 * Funcionalidades:
 * - Exibe nome da loja como link para página principal
 * - Campo de pesquisa de produtos com funcionalidade
 * - Botão do carrinho com indicador de itens
 * - Interface responsiva (desktop/mobile)
 * - Cores personalizadas baseadas no catálogo
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
// Importa ícones do pacote react-icons
import { HiSearch, HiShoppingCart } from "react-icons/hi"
// Importa o hook de contexto do catálogo
import { useCatalog } from "../../contexts/CatalogContext"
// Importa hook de navegação do Next.js
import { useRouter } from 'next/navigation';
// Importa hook de estado do React
import { useState } from "react";
// Importa componente de link do Next.js
import Link from "next/link";

// Componente da barra de navegação do catálogo
export default function CatalogNavbar({catalog}) {
    // Estado para controlar se está pesquisando (modo mobile)
    const [searching, setSearching] = useState(false)
    // Extrai funções e estados do contexto do catálogo
    const { cart, viewingCart, setViewingCart } = useCatalog()
    // Hook para navegação programática
    const router = useRouter();

    // Função que processa o envio do formulário de pesquisa
    const handleSubmit = (event) => {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        const formData = new FormData(event.target); // Obtém dados do formulário
        const searchedProduct = formData.get('searchedProduct'); // Extrai o termo pesquisado
        // Navega para a página principal com o termo de pesquisa
        router.push(`/catalog/${catalog.id}?searchedProduct=${searchedProduct}`);
    };

    return (
        {/* Container principal da navbar com layout flexível */}
        <div className="flex flex-wrap justify-around items-center p-5" style={{backgroundColor: catalog.secondary_color, color: catalog.text_color}}>
            {/* Link para página principal do catálogo com nome da loja */}
            <Link href={`/catalog/${catalog.id}`}>
                <h1 className="text-center font-bold text-lg">{catalog.store_name}</h1>
            </Link>
            
            {/* Botões para mobile (pesquisa e carrinho) */}
            <div className="hidden max-md:flex flex-row">
              {/* Botão de pesquisa (visível apenas no mobile) */}
              <button className="p-2 px-3 hidden max-md:block" onClick={() => setSearching(!searching)}>
                <HiSearch className="w-6 h-6"/>
              </button>
              
              {/* Botão do carrinho com indicador de itens */}
              <button className="p-2 px-3 relative" onClick={() => setViewingCart(!viewingCart)}>
                {/* Indicador visual quando há itens no carrinho */}
                {cart.length > 0 && (
                  <div className="bg-red-500 p-1 absolute top-1.5 right-2.5 rounded-full animate-bounce"></div>
                )}
                <HiShoppingCart className="w-6 h-6"/>
              </button>
            </div>
            
            {/* Container do campo de pesquisa e botão do carrinho (desktop) */}
            <div className={`max-w-sm w-full max-md:${searching && 'hidden'} max-md:mt-2 flex flex-row`}>
              {/* Formulário de pesquisa */}
              <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative">
                    {/* Ícone de pesquisa dentro do campo */}
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <HiSearch className="text-gray-500"/>
                    </div>
                    
                    {/* Campo de input para pesquisa */}
                    <input
                    onChange={(e) => e.target.value === "" && router.push(`?searchedProduct=`)} // Limpa pesquisa se campo estiver vazio
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`} // Efeito de foco
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'} // Remove efeito ao sair do foco
                    type="search" 
                    name="searchedProduct"
                    id="search-navbar" 
                    className="text-black hide-search-cancel block w-full p-2 py-3 ps-10 text-sm border border-gray-300 rounded focus:!border-gray-300" 
                    placeholder="Pesquisar produto..."/>
                    
                    {/* Botão de envio da pesquisa */}
                    <button
                    type="submit"
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.primary_color}`} // Efeito de foco
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'} // Remove efeito ao sair do foco
                    className="absolute top-[5px] right-1.5 p-2.5 px-4 rounded hover:opacity-90" 
                    style={{backgroundColor: catalog.tertiary_color}}
                    >
                      <HiSearch/>
                    </button>
                  </div>
              </form>
              
              {/* Botão do carrinho (visível apenas no desktop) */}
              <button className="p-2 px-3 relative max-md:hidden" onClick={() => setViewingCart(!viewingCart)}>
                {/* Indicador visual quando há itens no carrinho */}
                {cart.length > 0 && (
                  <div className="bg-red-500 p-1 absolute top-1.5 right-2.5 rounded-full animate-bounce"></div>
                )}
                <HiShoppingCart className="w-6 h-6"/>
              </button>
            </div>
        </div>
    )
}