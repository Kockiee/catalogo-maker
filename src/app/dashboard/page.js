/**
 * Página principal do dashboard
 * 
 * Este arquivo contém a página inicial do dashboard, onde o usuário
 * visualiza estatísticas dos últimos 7 dias (pedidos e faturamento)
 * e gerencia seus catálogos. Se o usuário não possui catálogos,
 * exibe um formulário para criar o primeiro catálogo.
 * 
 * Funcionalidades principais:
 * - Exibe estatísticas de pedidos dos últimos 7 dias
 * - Calcula e exibe faturamento dos últimos 7 dias
 * - Lista todos os catálogos do usuário
 * - Permite criar novo catálogo se não existir nenhum
 * - Interface responsiva para diferentes tamanhos de tela
 */

'use client'
// Importa o contexto de ferramentas para acessar dados do usuário
import { useTool } from "../contexts/ToolContext"
// Importa o componente para criar catálogos
import CreateCatalogContainer from "./components/CreateCatalogContainer"
// Importa o componente que exibe a tabela de catálogos
import CatalogsTable from "./components/CatalogsTable"
// Importa função utilitária para verificar se passaram 7 dias
import { passedSevenDaysOrMore } from "../utils/functions"
// Importa componente de atualizações (comentado)
import UpdatesContainer from "./components/UpdatesContainer"

// Componente principal da página do dashboard
export default function PAGE() {
    // Extrai catálogos e pedidos do contexto de ferramentas
    const { catalogs, orders } = useTool()

    // Variável para armazenar o faturamento total dos últimos 7 dias
    var billing = 0
    // Variável para contar pedidos dos últimos 7 dias
    var ordersInLastSevenDays = 0
    
    // Se existem pedidos, calcula estatísticas dos últimos 7 dias
    if (orders) {
        // Percorre todos os pedidos
        for (const order of orders) {
            // Verifica se o pedido foi criado nos últimos 7 dias
            if (!passedSevenDaysOrMore(order.created_at)) {
                ordersInLastSevenDays += 1 // Incrementa contador de pedidos
                // Se o pedido foi aceito, adiciona ao faturamento
                if (order.status === "accepted") {
                    billing += order.price
                }
            }
        }
    }

    return (
        <>
        {/* Se não existem catálogos, exibe formulário para criar o primeiro */}
        {catalogs === null ? (
            <CreateCatalogContainer/>
        ) : (
            <div className="flex flex-col">
                {/* Container responsivo com estatísticas dos últimos 7 dias */}
                <div className="flex flex-wrap space-x-2 max-lg:space-x-0 max-lg:space-y-2 my-2 justify-center h-full">
                    {/* Card de estatísticas de pedidos */}
                    <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md h-full">
                        <h1 className="text-2xl font-bold mb-2">Pedidos nos últimos 7 dias</h1>
                        <p className="text-xl my-2"><span className="font-black">{orders ? orders.length : 0}</span> Pedidos</p>
                        <div className="bg-gray-300 border border-gray-400 p-2 text-sm rounded">
                            <h1 className="font-bold">OBS:</h1>
                            <p>O valor acima inclui tanto pedidos aceitos como não aceitos ainda.</p>
                        </div>
                    </div>
                    {/* Card de estatísticas de faturamento */}
                    <div className="p-4 bg-lightcyan rounded-lg w-2/5 max-lg:w-full shadow-md h-full">
                        <h1 className="text-2xl font-bold mb-2">Faturamento nos últimos 7 dias</h1>
                        <p className="text-xl my-2 font-medium">{(billing).toLocaleString('pt-BR', {style: "currency", currency: "BRL"})}</p>
                        <div className="bg-gray-300 border border-gray-400 p-2 text-sm rounded">
                            <h1 className="font-bold">OBS:</h1>
                            <p>No faturamento só são incluídos pedidos aceitos.</p>
                        </div>
                    </div>
                    {/* Componente de atualizações (comentado) */}
                    {/* <UpdatesContainer/> */}
                </div>
                {/* Seção de catálogos do usuário */}
                <div className="w-full mt-2">
                    <h1 className="text-2xl font-bold mb-2">Seus Catálogos</h1>
                    <CatalogsTable/>
                </div>
            </div>
        )}
        </>
    )
}