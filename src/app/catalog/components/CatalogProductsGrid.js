/**
 * COMPONENTE DE GRADE DE PRODUTOS DO CATÁLOGO
 * 
 * Este arquivo contém o componente que renderiza a grade de produtos do catálogo.
 * Exibe todos os produtos em um layout de grade com funcionalidades de busca,
 * ordenação e adição rápida ao carrinho.
 * 
 * Funcionalidades:
 * - Exibição de produtos em layout de grade responsivo
 * - Busca de produtos por nome (com normalização de caracteres)
 * - Ordenação por menor preço, maior preço ou ordem alfabética
 * - Adição rápida de produtos ao carrinho com variação padrão
 * - Exibição de imagem, nome e preço de cada produto
 * - Link para visualização detalhada de cada produto
 * - Mensagem quando nenhum produto é encontrado
 * - Estilos dinâmicos baseados nas cores do catálogo
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente

// Importa hook para obter parâmetros de busca da URL
import { useSearchParams } from "next/navigation";
// Importa hook do contexto do catálogo para gerenciar carrinho
import { useCatalog } from "../../contexts/CatalogContext";
// Importa ícones para dropdown e carrinho de compras
import { HiChevronDown, HiShoppingCart } from "react-icons/hi";
// Importa componentes de dropdown do Flowbite
import { Dropdown, DropdownItem } from "flowbite-react";
// Importa hook useState para gerenciar estado local
import { useState } from "react";
// Importa componente Link do Next.js para navegação otimizada
import Link from "next/link";

// Componente principal da grade de produtos
export default function CatalogProductsGrid({catalog}) {
    // Obtém a função de adicionar produto ao carrinho do contexto
    const { addProductToCatalog } = useCatalog();
    // Obtém os parâmetros de busca da URL
    const searchParams = useSearchParams()
    // Extrai o nome do produto pesquisado da URL ou null se não houver
    const searchedName = searchParams.get('searchedProduct') || null;
    // Estado para armazenar a ordem de classificação selecionada
    const [order, setOrder] = useState()

    // Função que verifica se uma string contém um padrão (com normalização)
    // Remove acentos e caracteres especiais para busca mais flexível
    const stringContainsPattern = (string, pattern) => {
        // Normaliza a string removendo acentos (NFD = Normalization Form Decomposed)
        const normalizedString = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');
        // Normaliza o padrão de busca da mesma forma
        const normalizedPattern = pattern.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');

        // Cria uma expressão regular case-insensitive com o padrão normalizado
        const regex = new RegExp(normalizedPattern, 'i');
        // Testa se a string normalizada contém o padrão
        return regex.test(normalizedString);
    }

    // Função que renderiza a lista de produtos
    const renderProducts = () => {
        // Filtra produtos por nome se houver busca, caso contrário mostra todos
        const products = searchedName ? 
        catalog.products.filter(product => stringContainsPattern(product.name, searchedName)) 
        : catalog.products

        // Aplica ordenação baseada na seleção do usuário
        if (order === "minPrice") {
            // Ordena do menor para o maior preço
            products.sort((a, b) => a.price - b.price);
        } else if (order === "maxPrice") {
            // Ordena do maior para o menor preço
            products.sort((a, b) => b.price - a.price);
        } else if (order === "byAlphabet") {
            // Ordena alfabeticamente por nome (A-Z)
            products.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Se há produtos para exibir
        if(products.length > 0) {
            // Mapeia cada produto e retorna um card
            return products.map((product, index) => (
                // Container do card do produto com borda na cor terciária
                <div key={index} className="p-2 rounded space-y-2 m-1" style={{border: `1px solid ${catalog.tertiary_color}`}}>
                    {/* Link para a página detalhada do produto */}
                    <Link href={`/catalog/${catalog.id}/${product.id}`} className="">
                        {/* Imagem principal do produto */}
                        <img src={product.images[0]} alt={`Imagem principal de ${product.name}`} className="size-44 rounded" />
                        {/* Preço do produto formatado em reais (BRL) */}
                        <h1 className="font-bold text-lg" style={{color: catalog.tertiary_color}}>{product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</h1>
                        {/* Nome do produto com cor do texto dinâmica */}
                        <h2 className="font-semibold" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>{product.name}</h2>
                    </Link>
                    {/* Botão de adicionar ao carrinho */}
                    <button
                    // Função chamada ao clicar - adiciona produto com primeira variação de cada tipo
                    onClick={() => addProductToCatalog(
                        product, 
                        // Mapeia as variações do produto e seleciona a primeira opção de cada
                        product.variations.map(variation => {return {name: variation.name, variants: variation.variants[0]}})    
                    )}
                    // Efeito de foco - adiciona sombra na cor terciária
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                    // Efeito de blur - remove a sombra
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                    // Classes de estilo para o botão
                    className="rounded p-2.5 px-6 inline-flex items-center justify-center text-sm hover:opacity-80 w-full" 
                    // Cor de fundo dinâmica baseada na cor secundária do catálogo
                    style={{backgroundColor: catalog.secondary_color}}
                    >
                        Adicionar <HiShoppingCart className="w-5 h-5 ml-1"/> {/* Texto e ícone */}
                    </button>
                </div>
            ));
        } else { // Se não há produtos para exibir
            // Retorna mensagem de que nenhum item foi encontrado
            return (
                <p className="text-lg text-center w-full">Nenhum item foi encontrado...</p>
            )
        }
    }

    return (
        // Container principal da grade de produtos
        <div className="space-y-2">
            {/* Seção do botão de ordenação */}
            <div className="w-full">
                {/* Dropdown para seleção de ordenação */}
                <Dropdown 
                // Função que renderiza o botão customizado do dropdown
                renderTrigger={() => (
                <button
                // Efeito de foco - adiciona sombra na cor terciária
                onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                // Efeito de blur - remove a sombra
                onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                // Classes de estilo para o botão
                className="rounded p-3 px-6 inline-flex items-center text-sm hover:opacity-80" 
                // Cor de fundo dinâmica baseada na cor secundária do catálogo
                style={{backgroundColor: catalog.secondary_color}}>
                    Ordenar por <HiChevronDown className="w-5 h-5 ml-1"/> {/* Texto e ícone */}
                </button>
                )} 
                color="light" // Cor do dropdown
                label="Dropdown button" // Label acessível
                dismissOnClick={false}> {/* Não fecha ao clicar em item */}
                  {/* Opção para ordenar por menor preço */}
                  <DropdownItem onClick={() => setOrder("minPrice")}>Menor preço</DropdownItem>
                  {/* Opção para ordenar por maior preço */}
                  <DropdownItem onClick={() => setOrder("maxPrice")}>Maior preço</DropdownItem>
                  {/* Opção para ordenar alfabeticamente */}
                  <DropdownItem onClick={() => setOrder("byAlphabet")}>Ordem alfabética (A-Z)</DropdownItem>
                </Dropdown>
            </div>
            {/* Container da grade de produtos */}
            <div className="flex flex-wrap items-center w-full">
                {/* Renderiza os produtos usando a função renderProducts */}
                {renderProducts()}
            </div>
        </div>
    )
}
