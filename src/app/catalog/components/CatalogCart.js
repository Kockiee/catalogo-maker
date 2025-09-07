'use client'
import { HiMinus, HiPlus, HiShoppingBag, HiX } from "react-icons/hi";
import { useCatalog } from "../../contexts/CatalogContext"
import { useEffect } from "react";
import Link from "next/link"

export default function CatalogCart({catalog}) {
    const { viewingCart, setViewingCart, cart, removeProductFromCatalog, addProductToCatalog } = useCatalog()
    
    useEffect(() => {
        return () => setViewingCart(true);
    }, [cart])

    const renderProducts = () => {
        return cart.map((product, index) => (
            <div key={index} className="border p-1 rounded flex flex-row">
                <Link href={`/catalog/${catalog.id}/${product.id}`}>
                    <div>
                        <img src={product.images[0]} alt={product.name} className="size-20 rounded border"/>
                    </div>
                </Link>
                <div className="flex flex-col p-2">
                    <Link href={`/catalog/${catalog.id}/${product.id}`}>
                        <h1 className="text-base font-medium">{product.name}</h1>
                        {product.variations.map((variation, index) => (
                            <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>{variation.name}: {variation.variants}</h2>
                        ))}
                        <p className="text-sm font-bold">{(product.price * product.quantity).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    </Link>
                    <div className="relative flex items-center max-w-[8rem] mt-2">
                        <button
                        onClick={() => removeProductFromCatalog(product.id, product.variations)}
                        type="button"
                        style={{backgroundColor: catalog.secondary_color}} 
                        className="hover:opacity-80 border border-gray-300 rounded-s-lg p-2 h-9">
                            <HiMinus/>
                        </button>

                        <input 
                        value={product.quantity} 
                        type="text" 
                        id="quantity-input" 
                        className="bg-transparent focus:ring-0 focus:border-none border-x-0 border-gray-300 h-9 text-center text-sm block w-full py-2.5" 
                        required />

                        <button
                        onClick={() => addProductToCatalog(product, product.variations)}
                        type="button" 
                        style={{backgroundColor: catalog.secondary_color}} 
                        className="hover:opacity-80 border border-gray-300 rounded-e-lg p-2 h-9">
                            <HiPlus/>
                        </button>
                    </div>
                </div>
            </div>
        ))
    } 

    return (
        <div className={`max-w-sm w-full fixed top-0 right-0 z-20 transition-transform duration-300 ease-in-out transform ${viewingCart ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 space-y-2 w-full h-full min-h-screen" style={{backgroundColor: catalog.tertiary_color}}>
            {/* <div className="p-6 space-y-2 w-full h-full min-h-screen" style={{backgroundColor: catalog.tertiary_color}}> */}
                <div className="flex justify-between mb-4">
                    <h1 className="text-lg font-bold inline-flex items-center">Seu carrinho <HiShoppingBag className="w-6 h-6 ml-1"/></h1>
                    <button onClick={() => setViewingCart(!viewingCart)} className="p-2">
                        <HiX className="w-7 h-7"/>
                    </button>
                </div>
                {cart.length > 0 ? renderProducts() : <p className="text-sm">Você ainda não adicionou nenhum item ao carrinho...</p>}
                <Link href={`/catalog/${catalog.id}/payment`}>
                    <button
                    disabled={cart.length === 0 ? true : false}
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.primary_color}`}
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                    className="rounded mt-4 p-3.5 px-6 inline-flex items-center justify-center text-sm hover:opacity-80 w-full disabled:opacity-70" 
                    style={{backgroundColor: catalog.secondary_color}}
                    >
                        Finalizar pedido
                    </button>
                </Link>
            </div>
        </div>
    );
}