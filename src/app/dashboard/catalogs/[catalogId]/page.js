'use client'
import EditCatalogContainer from "@/app/components/EditCatalogContainer";
import PhoneVerification from "@/app/components/PhoneVerification";
import ProductsTable from "@/app/components/ProductsTable";
import { useTool } from "@/app/contexts/ToolContext"
import { Tooltip } from "flowbite-react";
import { notFound } from 'next/navigation'
import { HiShare } from "react-icons/hi";

export default function PAGE({ params }) {
  const catalogId = params.catalogId
  const { catalogs } = useTool()
  const catalog = catalogs.find(catalog => catalog.id === catalogId);

  if (!catalog) {
    notFound()
  }

  return (
    <div>
      {catalog.whatsapp_session ? (
        <>
          <div className="flex flex-row max-lg:flex-col justify-between max-lg:justify-normal mb-4">
            <h1 className="font-black text-3xl mb-4">Catálogo {catalog.name}</h1>
            <div className="relative w-1/2 max-lg:w-full bg-clip-padding border-dashed h-full p-4 rounded ring-0 border-4 border-jordyblue bg-white">
              <input type="text" className="focus:border-none focus:ring-0 border-none p-0 w-full bg-transparent" value={`${process.env.NEXT_PUBLIC_SITE_URL}/catalog/${catalog.id}`} readOnly/>
              <div className="absolute right-2 top-0 h-full flex items-center">
                <Tooltip className="w-42" content="Copiar link do catálogo" placement="top-end" arrow={false} trigger="hover">
                  <Tooltip content="Link copiado com sucesso !" placement="left" className="bg-green-400" arrow={false} trigger="click">
                    <button className="bg-gray-200 rounded p-2 border border-gray-300" onClick={() => {
                      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/catalog/${catalog.id}`)
                    }}>
                      <HiShare className="w-6 h-6 text-neonblue"/>
                    </button>
                  </Tooltip>
                </Tooltip>
              </div>
            </div>
          </div>
          <EditCatalogContainer catalogId={catalogId}/>
          <h2 className="font-bold text-2xl mt-4" id="products-table">Produtos</h2>
          <ProductsTable catalogId={catalogId} />
        </>
      ) : (
        <PhoneVerification catalogId={catalogId}/>
      )}
    </div>
  )
}