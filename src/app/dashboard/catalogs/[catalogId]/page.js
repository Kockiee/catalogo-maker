'use client'
// Importação do componente para editar catálogo
import EditCatalogContainer from "@/app/dashboard/catalogs/components/EditCatalogContainer";
// Importação do componente de tabela de produtos
import ProductsTable from "@/app/dashboard/catalogs/components/ProductsTable";
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext"
// Importação de componentes do Flowbite React
import { Tooltip } from "flowbite-react";
// Importação de ícones
import { HiShare } from "react-icons/hi";

/**
 * Página principal de um catálogo específico
 * Exibe informações do catálogo, link compartilhável e lista de produtos
 * @param {Object} params - Parâmetros da URL incluindo catalogId
 * @returns {JSX.Element} Interface do catálogo específico
 */
export default function PAGE({ params }) {
  // Extrai o ID do catálogo dos parâmetros da URL
  const catalogId = params.catalogId
  // Desestruturação dos dados do contexto de ferramentas
  const { catalogs } = useTool()
  // Encontra o catálogo específico na lista de catálogos
  const catalog = catalogs.find(catalog => catalog.id === catalogId);

  // Renderiza a interface da página do catálogo
  return (
    <div>
      {/* Cabeçalho com título e link compartilhável */}
      <div className="flex flex-row max-lg:flex-col justify-between max-lg:justify-normal mb-4">
        {/* Título da página com nome do catálogo */}
        <h1 className="font-black text-3xl mb-4">Catálogo "{catalog.name}"</h1>

        {/* Container do link compartilhável */}
        <div className="relative w-1/2 max-lg:w-full bg-clip-padding border-dashed h-full p-4 rounded-lg ring-0 border-4 border-jordyblue bg-white">
          {/* Campo de texto com o link do catálogo (somente leitura) */}
          <input
            type="text"
            className="focus:border-none focus:ring-0 border-none p-0 w-full bg-transparent"
            value={`${process.env.NEXT_PUBLIC_SITE_URL}/catalog/${catalog.id}`}
            readOnly
          />
          {/* Botão para copiar o link */}
          <div className="absolute right-2 top-0 h-full flex items-center">
            <Tooltip className="w-42" content="Copiar link do catálogo" placement="top-end" arrow={false} trigger="hover">
              <Tooltip content="Link copiado com sucesso!" placement="left" className="bg-green-400" arrow={false} trigger="click">
                <button
                  className="bg-gray-200 rounded p-2 border border-gray-300"
                  onClick={() => {
                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/catalog/${catalog.id}`)
                  }}
                >
                  <HiShare className="w-6 h-6 text-neonblue"/>  {/* Ícone de compartilhamento */}
                </button>
              </Tooltip>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Componente para editar as configurações do catálogo */}
      <EditCatalogContainer catalogId={catalogId}/>

      {/* Seção de produtos */}
      <h2 className="font-bold text-2xl mt-4" id="products-table">Produtos</h2>
      {/* Tabela com lista de produtos do catálogo */}
      <ProductsTable catalogId={catalogId} />
    </div>
  )
}