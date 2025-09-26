'use client'
// Importação do contexto de ferramentas do dashboard
import { useTool } from "../contexts/ToolContext"
// Importação do componente para criar novo catálogo
import CreateCatalogContainer from "./components/CreateCatalogContainer"
// Importação do componente de tabela de catálogos
import CatalogsTable from "./components/CatalogsTable"
// Importação da função utilitária para verificar se passaram 7 dias
import { passedSevenDaysOrMore } from "../utils/functions"
// Importação do componente de atualizações
import UpdatesContainer from "./components/UpdatesContainer"

/**
 * Página principal do dashboard
 * Exibe estatísticas dos últimos 7 dias e lista de catálogos
 * Se não houver catálogos, mostra interface para criar o primeiro
 * @returns {JSX.Element} Interface do dashboard
 */
export default function PAGE() {
    // Desestruturação dos dados do contexto de ferramentas
    const { catalogs, orders } = useTool()

    // Variáveis para armazenar estatísticas calculadas
    var billing = 0                    // Faturamento total dos últimos 7 dias
    var ordersInLastSevenDays = 0      // Total de pedidos nos últimos 7 dias

    // Cálculo das estatísticas se houver pedidos
    if (orders) {
        for (const order of orders) {
            // Verifica se o pedido foi criado nos últimos 7 dias
            if (!passedSevenDaysOrMore(order.created_at)) {
                ordersInLastSevenDays += 1  // Conta o pedido
                // Se o pedido foi aceito, adiciona ao faturamento
                if (order.status === "accepted") {
                    billing += order.price
                }
            }
        }
    }

    // Renderiza o conteúdo do dashboard
    return (
        <>
        {/* Verificação condicional: se não há catálogos, mostra interface de criação */}
        {catalogs === null ? (
            <CreateCatalogContainer/>
        ) : (
            <div className="flex flex-col">
                {/* Seção de estatísticas dos últimos 7 dias */}
                <div className="flex flex-wrap space-x-2 max-lg:space-x-0 max-lg:space-y-2 my-2 justify-center h-full">
                    {/* Card de estatísticas de pedidos */}
                    <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md h-full">
                        <h1 className="text-2xl font-bold mb-2">Pedidos nos últimos 7 dias</h1>
                        <p className="text-xl my-2">
                            <span className="font-black">{orders ? ordersInLastSevenDays : 0}</span> Pedidos
                        </p>
                        <div className="bg-gray-300 border border-gray-400 p-2 text-sm rounded">
                            <h1 className="font-bold">OBS:</h1>
                            <p>O valor a cima inclúi tanto pedidos aceitos como não aceitos ainda.</p>
                        </div>
                    </div>
                    {/* Card de estatísticas de faturamento */}
                    <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md h-full">
                        <h1 className="text-2xl font-bold mb-2">Faturamento nos últimos 7 dias</h1>
                        <p className="text-xl my-2 font-medium">
                            {billing.toLocaleString('pt-BR', {style: "currency", currency: "BRL"})}
                        </p>
                        <div className="bg-gray-300 border border-gray-400 p-2 text-sm rounded">
                            <h1 className="font-bold">OBS:</h1>
                            <p>No faturamento só são incluídos pedidos aceitos.</p>
                        </div>
                    </div>
                    {/* Componente de atualizações (comentado temporariamente) */}
                    {/* <UpdatesContainer/> */}
                </div>
                {/* Seção da tabela de catálogos */}
                <div className="w-full mt-2">
                    <h1 className="text-2xl font-bold mb-2">Seus Catálogos</h1>
                    <CatalogsTable/>  {/* Tabela com lista de catálogos do usuário */}
                </div>
            </div>
        )}
        </>
    )
}