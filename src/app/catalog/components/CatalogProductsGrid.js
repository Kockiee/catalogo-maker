'use client'
// Indica que este componente deve ser renderizado no cliente (Next.js App Router)

import { useSearchParams } from "next/navigation"; // Hook para capturar query params da URL
import { useCatalog } from "../../contexts/CatalogContext"; // Contexto que gerencia o catálogo e carrinho
import { HiChevronDown, HiShoppingCart } from "react-icons/hi"; // Ícones usados na interface
import { Dropdown, DropdownItem } from "flowbite-react"; // Componentes de UI para dropdown
import { useState } from "react"; // Hook de estado do React
import Link from "next/link"; // Componente de link do Next.js para navegação entre páginas

// Componente que renderiza os produtos de um catálogo em formato de grid (grade)
export default function CatalogProductsGrid({catalog}) {
    // Hook do contexto que permite adicionar produtos ao catálogo/carrinho
    const { addProductToCatalog } = useCatalog();

    // Captura os parâmetros da URL, como ?searchedProduct=...
    const searchParams = useSearchParams();

    // Obtém o valor do parâmetro 'searchedProduct' ou null se não existir
    const searchedName = searchParams.get('searchedProduct') || null;

    // Estado que guarda a ordem de exibição dos produtos (minPrice, maxPrice, byAlphabet)
    const [order, setOrder] = useState();

    // Função auxiliar que verifica se uma string contém um padrão, ignorando acentos e caracteres especiais
    const stringContainsPattern = (string, pattern) => {
        // Normaliza e remove acentos/caracteres especiais da string original
        const normalizedString = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');
        // Normaliza e remove acentos/caracteres especiais do padrão
        const normalizedPattern = pattern.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');

        // Cria regex case-insensitive com o padrão e testa na string
        const regex = new RegExp(normalizedPattern, 'i');
        return regex.test(normalizedString);
    }

    // Função que renderiza os produtos filtrados e ordenados
    const renderProducts = () => {
        // Se houver busca, filtra os produtos pelo nome
        const products = searchedName ? 
        catalog.products.filter(product => stringContainsPattern(product.name, searchedName)) 
        : catalog.products;

        // Ordena os produtos conforme seleção do usuário
        if (order === "minPrice") {
            products.sort((a, b) => a.price - b.price); // Menor preço
        } else if (order === "maxPrice") {
            products.sort((a, b) => b.price - a.price); // Maior preço
        } else if (order === "byAlphabet") {
            products.sort((a, b) => a.name.localeCompare(b.name)); // Ordem alfabética
        }

        // Renderiza lista de produtos ou mensagem caso não encontre nenhum
        if(products.length > 0) {
            return products.map((product, index) => (
                <div 
                    key={index} 
                    className="p-2 rounded space-y-2 m-1" 
                    style={{border: `1px solid ${catalog.tertiary_color}`}}
                >
                    {/* Link para a página do produto */}
                    <Link href={`/catalog/${catalog.id}/${product.id}`}>
                        <img 
                            src={product.images[0]} 
                            alt={`Imagem principal de ${product.name}`} 
                            className="size-44 rounded" 
                        />
                        <h1 
                            className="font-bold text-lg" 
                            style={{color: catalog.tertiary_color}}
                        >
                            {product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}
                        </h1>
                        <h2 
                            className="font-semibold" 
                            style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}
                        >
                            {product.name}
                        </h2>
                    </Link>

                    {/* Botão para adicionar produto ao catálogo/carrinho */}
                    <button
                        onClick={() => addProductToCatalog(
                            product, 
                            product.variations.map(variation => { 
                                return {name: variation.name, variants: variation.variants[0]} 
                            })    
                        )}
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                        className="rounded p-2.5 px-6 inline-flex items-center justify-center text-sm hover:opacity-80 w-full" 
                        style={{backgroundColor: catalog.secondary_color}}
                    >
                        Adicionar <HiShoppingCart className="w-5 h-5 ml-1"/>
                    </button>
                </div>
            ));
        } else {
            return (
                <p className="text-lg text-center w-full">Nenhum item foi encontrado...</p>
            )
        }
    }

    // Renderização principal do componente
    return (
        <div className="space-y-2">
            {/* Dropdown para selecionar a ordem de exibição */}
            <div className="w-full">
                <Dropdown 
                    renderTrigger={() => (
                        <button
                            onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                            onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                            className="rounded p-3 px-6 inline-flex items-center text-sm hover:opacity-80" 
                            style={{backgroundColor: catalog.secondary_color}}
                        >
                            Ordenar por <HiChevronDown className="w-5 h-5 ml-1"/>
                        </button>
                    )} 
                    color="light" 
                    label="Dropdown button" 
                    dismissOnClick={false}
                >
                  <DropdownItem onClick={() => setOrder("minPrice")}>Menor preço</DropdownItem>
                  <DropdownItem onClick={() => setOrder("maxPrice")}>Maior preço</DropdownItem>
                  <DropdownItem onClick={() => setOrder("byAlphabet")}>Ordem alfabética (A-Z)</DropdownItem>
                </Dropdown>
            </div>

            {/* Grid flexível de produtos */}
            <div className="flex flex-wrap items-center w-full">
                {renderProducts()}
            </div>
        </div>
    )
}