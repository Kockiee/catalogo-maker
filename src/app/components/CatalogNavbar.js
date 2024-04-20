'use client'
import { HiSearch, HiShoppingCart } from "react-icons/hi"
import { useCatalog } from "../contexts/CatalogContext"
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Link from "next/link";

export default function CatalogNavbar({catalog}) {
    const [searching, setSearching] = useState(false)
    const { cart, viewingCart, setViewingCart } = useCatalog()
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchedProduct = formData.get('searchedProduct');
        router.push(`/catalog/${catalog.id}?searchedProduct=${searchedProduct}`);
    };

    return (
        <div className="flex flex-wrap justify-around items-center p-5" style={{backgroundColor: catalog.secondary_color, color: catalog.text_color}}>
            <Link href={`/catalog/${catalog.id}`}><h1 className="text-center font-bold text-lg">{catalog.store_name}</h1></Link>
            <div className="hidden max-md:flex flex-row">
              <button className="p-2 px-3 hidden max-md:block" onClick={() => setSearching(!searching)}>
                <HiSearch className="w-6 h-6"/>
              </button>
              <button className="p-2 px-3 relative" onClick={() => setViewingCart(!viewingCart)}>
                {cart.length > 0 && (
                  <div className="bg-red-500 p-1 absolute top-1.5 right-2.5 rounded-full animate-bounce"></div>
                )}
                <HiShoppingCart className="w-6 h-6"/>
              </button>
            </div>
            
            <div className={`max-w-sm w-full max-md:${searching && 'hidden'} max-md:mt-2 flex flex-row`}>
              <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <HiSearch className="text-gray-500"/>
                    </div>
                    <input
                    onChange={(e) => e.target.value === "" && router.push(`?searchedProduct=`)}
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.tertiary_color}`}
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                    type="search" 
                    name="searchedProduct"
                    id="search-navbar" 
                    className="text-black hide-search-cancel block w-full p-2 py-3 ps-10 text-sm border border-gray-300 rounded focus:!border-gray-300" 
                    placeholder="Pesquisar produto..."/>
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