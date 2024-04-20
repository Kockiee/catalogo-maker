'use client'
import { useSearchParams } from "next/navigation";
import { useCatalog } from "../contexts/CatalogContext";
import { HiChevronDown, HiShoppingCart } from "react-icons/hi";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useState } from "react";
import Link from "next/link";

export default function CatalogProductsGrid({catalog}) {
    const { addProductToCatalog } = useCatalog();
    const searchParams = useSearchParams()
    const searchedName = searchParams.get('searchedProduct') || null;
    const [order, setOrder] = useState()

    const stringContainsPattern = (string, pattern) => {
        const normalizedString = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');
        const normalizedPattern = pattern.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');

        const regex = new RegExp(normalizedPattern, 'i');
        return regex.test(normalizedString);
    }

    const renderProducts = () => {
        const products = searchedName ? 
        catalog.products.filter(product => stringContainsPattern(product.name, searchedName)) 
        : catalog.products

        if (order === "minPrice") {
            products.sort((a, b) => a.price - b.price);
        } else if (order === "maxPrice") {
            products.sort((a, b) => b.price - a.price);
        } else if (order === "byAlphabet") {
            products.sort((a, b) => a.name.localeCompare(b.name));
        }

        if(products.length > 0) {
            return products.map((product, index) => (
                <div key={index} className="p-2 rounded space-y-2 m-1" style={{border: `1px solid ${catalog.tertiary_color}`}}>
                    <Link href={`/catalog/${catalog.id}/${product.id}`} className="">
                        <img src={product.images[0]} alt={`Imagem principal de ${product.name}`} className="size-44 rounded" />
                        <h1 className="font-bold text-lg" style={{color: catalog.tertiary_color}}>{product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</h1>
                        <h2 className="font-semibold" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>{product.name}</h2>
                    </Link>
                    <button
                    onClick={() => addProductToCatalog(
                        product, 
                        product.variations.map(variation => {return {name: variation.name, variants: variation.variants[0]}})    
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

    return (
        <div className="space-y-2">
            <div className="w-full">
                <Dropdown 
                renderTrigger={() => (
                <button
                onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                className="rounded p-3 px-6 inline-flex items-center text-sm hover:opacity-80" 
                style={{backgroundColor: catalog.secondary_color}}>
                    Ordenar por <HiChevronDown className="w-5 h-5 ml-1"/>
                </button>
                )} 
                color="light" 
                label="Dropdown button" 
                dismissOnClick={false}>
                  <DropdownItem onClick={() => setOrder("minPrice")}>Menor preço</DropdownItem>
                  <DropdownItem onClick={() => setOrder("maxPrice")}>Maior preço</DropdownItem>
                  <DropdownItem onClick={() => setOrder("byAlphabet")}>Ordem alfabética (A-Z)</DropdownItem>
                </Dropdown>
            </div>
            <div className="flex flex-wrap items-center w-full">
                {renderProducts()}
            </div>
        </div>
    )
}