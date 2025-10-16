/**
 * COMPONENTE DE PÁGINA DE PRODUTO DO CATÁLOGO
 * 
 * Este arquivo contém o componente que renderiza a página de visualização detalhada
 * de um produto individual dentro de um catálogo. Permite visualizar imagens,
 * descrição, preço e selecionar variações antes de adicionar ao carrinho.
 * 
 * Funcionalidades:
 * - Exibição de galeria de imagens do produto (carousel)
 * - Seleção de variações do produto (tamanho, cor, etc.)
 * - Adicionar produto ao carrinho com variações selecionadas
 * - Exibição de preço formatado em BRL
 * - Link de volta para o catálogo principal
 * - Botão de adicionar ao carrinho habilitado apenas quando todas variações forem selecionadas
 * - Estilos dinâmicos baseados nas cores do catálogo
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente

// Importa o hook do contexto do catálogo para gerenciar carrinho
import { useCatalog } from "@/app/contexts/CatalogContext";
// Importa componente de carousel do Flowbite para galeria de imagens
import { Carousel } from "flowbite-react";
// Importa componente Link do Next.js para navegação otimizada
import Link from "next/link"
// Importa hook useState para gerenciar estado local
import { useState } from "react";
// Importa ícones para seta de voltar e carrinho de compras
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi";

// Componente principal da página de produto
export default function CatalogProductPage({catalog, params}) {
    // Obtém a função de adicionar produto ao carrinho do contexto
    const { addProductToCatalog } = useCatalog();
    // Encontra o produto específico dentro do catálogo usando o ID da URL
    const product = catalog.products.find(object => object.id === params.productId);

    // Estado para armazenar as variações selecionadas pelo usuário
    // Inicializa com a primeira variação disponível
    const [selectedVariants, setSelectedVariants] = useState([{name: product.variations[0].name, variants: product.variations[0].variants[0]}]);
    
    // Função que gerencia a seleção de uma variação
    const handleVariantSelection = (variationName, variant) => {
        console.log(`Selecionada variação: ${variationName} - ${variant}`); // Log da seleção
        // Cria uma cópia do array de variações selecionadas
        const updatedVariants = [...selectedVariants];
        // Procura se já existe uma seleção para esta categoria de variação
        const existingVariantIndex = updatedVariants.findIndex(item => item.name === variationName);
        
        // Se já existe uma seleção para esta categoria de variação
        if (existingVariantIndex !== -1) {
            // Atualiza a variante selecionada
            updatedVariants[existingVariantIndex].variants = variant;
        } else { // Se não existe seleção para esta categoria
            // Adiciona nova variação ao array
            updatedVariants.push({ name: variationName, variants: variant });
        }
        
        // Atualiza o estado com as novas variações selecionadas
        setSelectedVariants(updatedVariants);

        // Garante que a variação pré-selecionada seja substituída
        console.log('Estado atualizado:', updatedVariants);
    };

    // Verifica se todas as variações foram selecionadas
    // Necessário para habilitar o botão de adicionar ao carrinho
    const allVariantsSelected = selectedVariants.length === product.variations.length;

    return (
        // Container principal com layout flexível que quebra em múltiplas linhas
        <div className="flex flex-wrap">
            {/* Seção do botão de voltar */}
            <div className="w-full">
                {/* Link para voltar à página principal do catálogo */}
                <Link href={`/catalog/${catalog.id}`} className="w-full py-5 text-lg inline-flex items-center">
                    <HiArrowLeft className="mr-2"/> Voltar {/* Ícone de seta e texto */}
                </Link>
            </div>
            
            {/* Seção da galeria de imagens do produto */}
            <div className="w-[400px] h-[400px] max-md:w-full p-4">
                <div className="w-full h-full">
                    {/* Carousel para exibir múltiplas imagens do produto */}
                    <Carousel className="">
                        {/* Mapeia cada URL de imagem e cria um elemento img */}
                        {product.images.map((url, index) => <img key={index} src={url} alt={product.name + index} />)}
                    </Carousel>
                </div>
            </div>
            
            {/* Seção de informações do produto */}
            <div className="w-1/2 max-md:w-full p-4 space-y-4" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
                {/* Nome do produto em destaque */}
                <h1 className="text-4xl font-bold">{product.name}</h1>
                
                {/* Preço do produto formatado em reais (BRL) */}
                <h2 className="text-2xl font-bold">{product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</h2>
                {/* Seção de seleção de variações */}
                <div className="space-y-2 text-xl">
                    {/* Mapeia cada tipo de variação (ex: tamanho, cor) */}
                    {product.variations.map((variation, variationIndex) => (
                        <div key={variationIndex}>
                            {/* Nome da categoria de variação (ex: "Tamanho") */}
                            <h3 className="font-medium">{variation.name}</h3>
                            
                            {/* Mapeia cada opção dentro da categoria (ex: P, M, G) */}
                            <div className="flex flex-wrap gap-2">
                                {variation.variants.map((variant, variantIndex) => {
                                    const isSelected = selectedVariants.find(item => item.name === variation.name && item.variants === variant);
                                    return (
                                        <button 
                                            key={variantIndex}
                                            // Classes de estilo com borda destacada quando selecionado
                                            className={`border rounded-lg text-base p-2 hover:opacity-80 cursor-pointer ${isSelected ? '!border-4' : ''}`} 
                                            // Estilos inline dinâmicos baseados nas cores do catálogo
                                            style={{
                                                color: catalog.text_color,
                                                backgroundColor: catalog.tertiary_color, 
                                                border: isSelected 
                                                    ? `4px solid ${catalog.tertiary_color}` 
                                                    : `4px dashed ${catalog.primary_color}`
                                            }}
                                            // Função chamada ao clicar no botão
                                            onClick={() => handleVariantSelection(variation.name, variant)}
                                            // Desabilita o botão se a variação já foi selecionada
                                            disabled={selectedVariants.some(item => item.name === variation.name && item.variants === variant)}
                                        >
                                            {variant} {/* Texto da variação (ex: "P", "Vermelho") */}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Botão de adicionar ao carrinho */}
                <button
                // Função chamada ao clicar - adiciona produto com variações selecionadas
                onClick={() => addProductToCatalog(
                    product, 
                    selectedVariants   
                )}
                // Efeito de foco - adiciona sombra na cor terciária
                onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                // Efeito de blur - remove a sombra
                onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                // Classes de estilo com opacidade reduzida se não todas variações foram selecionadas
                className={`rounded p-2.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full ${
                    allVariantsSelected ? '' : 'opacity-80 cursor-not-allowed'
                }`} 
                // Estilos inline dinâmicos baseados nas cores do catálogo
                style={{
                    color: catalog.text_color, 
                    backgroundColor: catalog.secondary_color
                }}
                // Desabilita o botão se nem todas as variações foram selecionadas
                disabled={!allVariantsSelected}
                >
                    Adicionar ao carrinho <HiShoppingCart className="w-7 h-7"/> {/* Texto e ícone */}
                </button>
                
                {/* Seção de descrição do produto */}
                <h1 className="text-xl font-bold pt-6">Descrição</h1>
                <p className="text-xl">{product.description}</p> {/* Texto da descrição */}
            </div>
        </div>
    )
}
