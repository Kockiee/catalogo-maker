'use client'
import { useTool } from "../contexts/ToolContext"
import CreateCatalogContainer from "../components/CreateCatalogContainer"
import CatalogsTable from "../components/CatalogsTable"
import { passedSevenDaysOrMore } from "../utils/functions"

export default function PAGE() {
    const { catalogs, orders } = useTool()

    var billing = 0
    var ordersInLastSevenDays = 0
    
    for (const order of orders) {
        if (!passedSevenDaysOrMore(order.created_at)) {
            ordersInLastSevenDays += 1
            if (order.status === "accepted") {
                billing += order.price
            }
        }
    }

    return (
        <>
        {catalogs === null ? (
            <CreateCatalogContainer/>
        ) : (
            <div className="flex flex-col">
                <div className="flex flex-wrap space-x-2 max-lg:space-x-0 max-lg:space-y-2 justify-center">
                    <div className="p-4 bg-lightcyan border-4 border-jordyblue rounded-lg w-2/5 max-lg:w-full">
                        <h1 className="text-2xl font-bold mb-2">Seus pedidos nos últimos 7 dias</h1>
                        <p className="text-xl my-2"><span className="font-black">{orders.length}</span> Pedidos</p>
                        <div className="bg-gray-300 border border-gray-400 p-2 text-sm rounded">
                            <h1 className="font-bold">OBS:</h1>
                            <p>O valor a cima inclúi tanto pedidos aceitos como não aceitos ainda.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-lightcyan border-4 border-jordyblue rounded-lg w-2/5 max-lg:w-full">
                        <h1 className="text-2xl font-bold mb-2">Seu Faturamento nos últimos 7 dias</h1>
                        <p className="text-xl my-2 font-medium">{(billing).toLocaleString('pt-BR', {style: "currency", currency: "BRL"})}</p>
                        <div className="bg-gray-300 border border-gray-400 p-2 text-sm rounded">
                            <h1 className="font-bold">OBS:</h1>
                            <p>No faturamento só são incluídos pedidos aceitos.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-2">
                    <h1 className="text-2xl font-bold mb-2">Seus Catálogos</h1>
                    <CatalogsTable/>
                </div>
            </div>
        )}
        </>
    )
}