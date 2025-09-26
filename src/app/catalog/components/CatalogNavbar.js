'use client' // Define que este componente será renderizado no client-side (Next.js)

// Importa ícones para pesquisa e carrinho
import { HiSearch, HiShoppingCart } from "react-icons/hi"
// Importa contexto para acessar informações do catálogo (carrinho, etc.)
import { useCatalog } from "../../contexts/CatalogContext"
// Hook do Next.js para navegação programática
import { useRouter } from 'next/navigation';
// Hook de estado do React
import { useState } from "react";
// Importa componente de link para navegação
import Link from "next/link";

export default function CatalogNavbar({catalog}) {
    // Estado que controla a exibição do campo de pesquisa em telas menores
    const [searching, setSearching] = useState(false)
    // Obtém do contexto: lista do carrinho, se o carrinho está visível e função para alterar isso
    const { cart, viewingCart, setViewingCart } = useCatalog()
    // Instância do roteador para navegação
    const router = useRouter();

    // Função chamada ao enviar o formulário de pesquisa
    const handleSubmit = (event) => {
        event.preventDefault(); // Previne reload da página
        const formData = new FormData(event.target); // Coleta dados do formulário
        const searchedProduct = formData.get('searchedProduct'); // Obtém valor do input
        // Redireciona para a URL com query param do produto pesquisado
        router.push(`/catalog/${catalog.id}?searchedProduct=${searchedProduct}`);
    };

    return (
        <div 
        className="flex flex-wrap justify-around items-center p-5" 
        style={{backgroundColor: catalog.secondary_color, color: catalog.text_color}}
        >
            {/* Nome da loja que leva para a página inicial do catálogo */}
            <Link href={`/catalog/${catalog.id}`}>
                <h1 className="text-center font-bold text-lg">{catalog.store_name}</h1>
            </Link>

            {/* Botões exibidos em dispositivos móveis */}
            <div className="hidden max-md:flex flex-row">
              {/* Botão que ativa/desativa a barra de pesquisa */}
              <button className="p-2 px-3 hidden max-md:block" onClick={() => setSearching(!searching)}>
                <HiSearch className="w-6 h-6"/>
              </button>
              {/* Botão para abrir/fechar o carrinho */}
              <button className="p-2 px-3 relative" onClick={() => setViewingCart(!viewingCart)}>
                {/* Badge vermelho animado se houver itens no carrinho */}
                {cart.length > 0 && (
                  <div className="bg-red-500 p-1 absolute top-1.5 right-2.5 rounded-full animate-bounce"></div>
                )}
                <HiShoppingCart className="w-6 h-6"/>
              </button>
            </div>
            
            {/* Área da barra de pesquisa e carrinho (desktop e mobile adaptado) */}
            <div className={`max-w-sm w-full max-md:${searching && 'hidden'} max-md:mt-2 flex flex-row`}>
              {/* Formulário de pesquisa */}
              <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative">
                    {/* Ícone dentro do input de pesquisa */}
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <HiSearch className="text-gray-500"/>
                    </div>
                    {/* Input de pesquisa */}
                    <input
                    onChange={(e) => e.target.value === "" && router.push(`?searchedProduct=`)} // Se campo esvaziar, reseta a busca
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                    type="search" 
                    name="searchedProduct"
                    id="search-navbar" 
                    className="text-black hide-search-cancel block w-full p-2 py-3 ps-10 text-sm border border-gray-300 rounded focus:!border-gray-300" 
                    placeholder="Pesquisar produto..."/>
                    {/* Botão de submit da pesquisa */}
                    <button
                    type="submit"
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.primary_color}`}
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                    className="absolute top-[5px] right-1.5 p-2.5 px-4 rounded hover:opacity-90" 
                    style={{backgroundColor: catalog.tertiary_color}}
                    >
                      <HiSearch/>
                    </button>
                  </div>
              </form>
              {/* Botão do carrinho (visível apenas em telas maiores) */}
              <button className="p-2 px-3 relative max-md:hidden" onClick={() => setViewingCart(!viewingCart)}>
                {cart.length > 0 && (
                  <div className="bg-red-500 p-1 absolute top-1.5 right-2.5 rounded-full animate-bounce"></div>
                )}
                <HiShoppingCart className="w-6 h-6"/>
              </button>
            </div>
        </div>
    )
}