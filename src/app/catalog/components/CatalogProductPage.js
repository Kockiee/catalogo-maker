'use client'
// Define que este componente deve ser renderizado no lado do cliente (Next.js App Router)

import { useCatalog } from "@/app/contexts/CatalogContext"; // Contexto que fornece funções do catálogo (como adicionar ao carrinho)
import { Carousel } from "flowbite-react"; // Componente pronto de carrossel
import Link from "next/link" // Componente de link do Next.js para navegação
import { useState } from "react"; // Hook de estado do React
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi"; // Ícones de seta e carrinho

// Componente de página que mostra os detalhes de um produto específico
export default function CatalogProductPage({catalog, params}) {
    // Função do contexto para adicionar produtos ao catálogo/carrinho
    const { addProductToCatalog } = useCatalog();

    // Localiza no catálogo o produto correspondente ao ID passado via params
    const product = catalog.products.find(object => object.id === params.productId);

    // Estado que guarda as variantes selecionadas pelo usuário
    // Inicializa com a primeira variação e seu primeiro valor
    const [selectedVariants, setSelectedVariants] = useState([
        {name: product.variations[0].name, variants: product.variations[0].variants[0]}
    ]);
    
    // Log para debug mostrando as variantes selecionadas
    console.log(selectedVariants);

    // Função para lidar com a seleção de variantes (cor, tamanho, etc.)
    const handleVariantSelection = (variationName, variant) => {
        const updatedVariants = [...selectedVariants]; // Copia o estado atual
        // Procura se já existe a variação selecionada
        const existingVariantIndex = updatedVariants.findIndex(item => item.name === variationName);
        
        if (existingVariantIndex !== -1) {
            // Se já existe, substitui pelo novo valor
            updatedVariants[existingVariantIndex].variants = variant;
        } else {
            // Caso contrário, adiciona a nova variação
            updatedVariants.push({ name: variationName, variants: variant });
        }
        
        // Atualiza o estado
        setSelectedVariants(updatedVariants);
    };

    // Verifica se o usuário selecionou todas as variações do produto
    const allVariantsSelected = selectedVariants.length === product.variations.length;

    return (
        <div className="flex flex-wrap">
            {/* Link para voltar à página principal do catálogo */}
            <div className="w-full">
                <Link href={`/catalog/${catalog.id}`} className="w-full py-5 text-lg inline-flex items-center">
                    <HiArrowLeft className="mr-2"/> Voltar
                </Link>
            </div>

            {/* Carrossel de imagens do produto */}
            <div className="w-[400px] h-[400px] max-md:w-full p-4">
                <div className="w-full h-full">
                    <Carousel>
                        {product.images.map((url, index) => 
                            <img key={index} src={url} alt={product.name + index} />
                        )}
                    </Carousel>
                </div>
            </div>

            {/* Área de informações do produto */}
            <div 
                className="w-1/2 max-md:w-full p-4 space-y-4" 
                style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}
            >
                {/* Nome e preço do produto */}
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <h2 className="text-2xl font-bold">
                    {product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}
                </h2>

                {/* Seletor de variações (exemplo: tamanho, cor) */}
                <div className="space-y-2 text-xl">
                    {product.variations.map((variation, variationIndex) => (
                        <div key={variationIndex}>
                            <h3 className="font-medium">{variation.name}</h3>
                            {variation.variants.map((variant, variantIndex) => (
                                <button 
                                    key={variantIndex}
                                    className={`border rounded-lg text-base p-2 hover:opacity-80 ${
                                        // Aplica borda destacada se esta variante estiver selecionada
                                        selectedVariants.find(item => item.name === variation.name && item.variants === variant) 
                                        ? 'border-4' : ''
                                    }`} 
                                    style={{
                                        color: catalog.text_color,
                                        backgroundColor: catalog.tertiary_color, 
                                        border: `4px dashed ${catalog.primary_color}`
                                    }}
                                    // Seleciona variante ao clicar
                                    onClick={() => handleVariantSelection(variation.name, variant)}
                                    // Desabilita botão se já houver uma escolha para esta variação
                                    disabled={selectedVariants.find(item => item.name === variation.name)}
                                >
                                    {variant}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Botão de adicionar ao carrinho */}
                <button
                    onClick={() => addProductToCatalog(product, selectedVariants)}
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                    className={`rounded p-2.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full ${
                        allVariantsSelected ? '' : 'opacity-80 cursor-not-allowed'
                    }`} 
                    style={{
                        color: catalog.text_color, 
                        backgroundColor: catalog.secondary_color
                    }}
                    // Só habilita o botão se todas as variações estiverem escolhidas
                    disabled={!allVariantsSelected}
                >
                    Adicionar ao carrinho <HiShoppingCart className="w-7 h-7"/>
                </button>

                {/* Descrição do produto */}
                <h1 className="text-xl font-bold pt-6">Descrição</h1>
                <p className="text-xl">{product.description}</p>
            </div>
        </div>
    )
}
