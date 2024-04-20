'use client'
import { useCatalog } from "@/app/contexts/CatalogContext";
import { Carousel } from "flowbite-react";
import Link from "next/link"
import { useState } from "react";
import { HiArrowLeft, HiShoppingCart } from "react-icons/hi";

export default function CatalogProductPage({catalog, params}) {
    const { addProductToCatalog } = useCatalog();
    const product = catalog.products.find(object => object.id === params.productId);

    const [selectedVariants, setSelectedVariants] = useState([{name: product.variations[0].name, variants: product.variations[0].variants[0]}]);
    
    console.log(selectedVariants)
    const handleVariantSelection = (variationName, variant) => {
        const updatedVariants = [...selectedVariants];
        const existingVariantIndex = updatedVariants.findIndex(item => item.name === variationName);
        
        if (existingVariantIndex !== -1) {
            updatedVariants[existingVariantIndex].variants = variant;
        } else {
            updatedVariants.push({ name: variationName, variants: variant });
        }
        
        setSelectedVariants(updatedVariants);
    };

    const allVariantsSelected = selectedVariants.length === product.variations.length;

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
                <Link href={`/catalog/${catalog.id}`} className="w-full py-5 text-lg inline-flex items-center"><HiArrowLeft className="mr-2"/> Voltar</Link>
            </div>
            <div className="w-[400px] h-[400px] max-md:w-full p-4">
                <div className="w-full h-full">
                    <Carousel className="">
                        {product.images.map((url, index) => <img key={index} src={url} alt={product.name + index} />)}
                    </Carousel>
                </div>
            </div>
            <div className="w-1/2 max-md:w-full p-4 space-y-4" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <h2 className="text-2xl font-bold">{product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</h2>
                <div className="space-y-2 text-xl">
                    {product.variations.map((variation, variationIndex) => (
                        <div key={variationIndex}>
                            <h3 className="font-medium">{variation.name}</h3>
                            {variation.variants.map((variant, variantIndex) => (
                                <button 
                                    key={variantIndex}
                                    className={`border rounded-lg text-base p-2 hover:opacity-80 ${
                                        selectedVariants.find(item => item.name === variation.name && item.variants === variant) ? 'border-4' : ''
                                    }`} 
                                    style={{
                                        color: catalog.text_color,
                                        backgroundColor: catalog.tertiary_color, 
                                        border: `4px dashed ${catalog.primary_color}`
                                    }}
                                    onClick={() => handleVariantSelection(variation.name, variant)}
                                    disabled={selectedVariants.find(item => item.name === variation.name)}
                                >
                                    {variant}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
                <button
                onClick={() => addProductToCatalog(
                    product, 
                    selectedVariants   
                )}
                onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                className={`rounded p-2.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full ${
                    allVariantsSelected ? '' : 'opacity-80 cursor-not-allowed'
                }`} 
                style={{
                    color: catalog.text_color, 
                    backgroundColor: catalog.secondary_color
                }}
                disabled={!allVariantsSelected}
                >
                    Adicionar ao carrinho <HiShoppingCart className="w-7 h-7"/>
                </button>
                <h1 className="text-xl font-bold pt-6">Descrição</h1>
                <p className="text-xl">{product.description}</p>
            </div>
        </div>
    )
}