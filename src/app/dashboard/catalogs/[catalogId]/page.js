/**
 * Página de detalhes de um catálogo específico
 * 
 * Este arquivo contém a página que exibe os detalhes de um catálogo
 * específico, incluindo informações do catálogo, link para compartilhamento
 * e tabela de produtos. Permite editar o catálogo e gerenciar seus produtos.
 * 
 * Funcionalidades principais:
 * - Exibição de informações do catálogo
 * - Link para compartilhamento com botão de copiar
 * - Edição do catálogo
 * - Gerenciamento de produtos do catálogo
 * - Interface responsiva
 */

'use client'
// Importa componente para editar catálogo
import EditCatalogContainer from "@/app/dashboard/catalogs/components/EditCatalogContainer";
// Importa componente de tabela de produtos
import ProductsTable from "@/app/dashboard/catalogs/components/ProductsTable";
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext"
// Importa componente Tooltip do Flowbite
import { Tooltip } from "flowbite-react";
// Importa ícone de compartilhamento
import { HiShare } from "react-icons/hi";

// Componente principal da página de detalhes do catálogo
export default function PAGE({ params }) {
  // Extrai o ID do catálogo dos parâmetros da URL
  const catalogId = params.catalogId
  // Extrai catálogos do contexto de ferramentas
  const { catalogs } = useTool()
  // Encontra o catálogo específico
  const catalog = catalogs.find(catalog => catalog.id === catalogId);

  return (
    <div>
      {/* Header com nome do catálogo e link de compartilhamento */}
      <div className="flex flex-row max-lg:flex-col justify-between max-lg:justify-normal mb-4">
        {/* Título com nome do catálogo */}
        <h1 className="font-black text-3xl mb-4">Catálogo "{catalog.name}"</h1>
        {/* Container do link de compartilhamento */}
        <div className="relative w-1/2 max-lg:w-full bg-clip-padding border-dashed h-full p-4 rounded-lg ring-0 border-4 border-jordyblue bg-white">
          {/* Input com link do catálogo (somente leitura) */}
          <input type="text" className="focus:border-none focus:ring-0 border-none p-0 w-full bg-transparent" value={`${process.env.NEXT_PUBLIC_SITE_URL}/catalog/${catalog.id}`} readOnly/>
          {/* Botão para copiar link */}
          <div className="absolute right-2 top-0 h-full flex items-center">
            <Tooltip className="w-42" content="Copiar link do catálogo" placement="top-end" arrow={false} trigger="hover">
              <Tooltip content="Link copiado com sucesso!" placement="left" className="bg-green-400" arrow={false} trigger="click">
                <button className="bg-gray-200 rounded p-2 border border-gray-300" onClick={() => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/catalog/${catalog.id}`) // Copia link para área de transferência
                }}>
                  <HiShare className="w-6 h-6 text-neonblue"/>
                </button>
              </Tooltip>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* Componente para editar catálogo */}
      <EditCatalogContainer catalogId={catalogId}/>
      {/* Título da seção de produtos */}
      <h2 className="font-bold text-2xl mt-4" id="products-table">Produtos</h2>
      {/* Tabela de produtos do catálogo */}
      <ProductsTable catalogId={catalogId} />
    </div>
  )
}