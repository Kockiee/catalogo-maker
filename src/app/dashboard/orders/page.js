/**
 * Página de pedidos do usuário
 * 
 * Este arquivo contém a página onde o usuário pode visualizar
 * todos os pedidos recebidos através dos seus catálogos.
 * Exibe uma lista de pedidos com informações detalhadas
 * e opções de gerenciamento.
 * 
 * Funcionalidades principais:
 * - Lista todos os pedidos do usuário
 * - Exibe informações detalhadas de cada pedido
 * - Permite gerenciar status dos pedidos
 * - Interface responsiva para diferentes dispositivos
 */

'use client'
// Importa componente que exibe a grade de pedidos
import OrdersGrid from "@/app/dashboard/orders/components/OrdersGrid";
import { useState } from 'react'
import { Button, Spinner } from 'flowbite-react'
import { FiRefreshCw } from 'react-icons/fi'
import { useTool } from '@/app/contexts/ToolContext'
import ButtonAPP from "@/app/components/ButtonAPP";

// Componente principal da página de pedidos
export default function PAGE () {
  const { updateOrders } = useTool()
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    try {
      setLoading(true)
      await updateOrders()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-col space-y-2 ">
      {/* Header com título e botão de atualizar */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seus pedidos</h1>
        <div>
          <ButtonAPP onClick={handleRefresh}>
            {loading ? <Spinner size="sm"/> : (<><FiRefreshCw className="w-4 h-4 mr-2"/>Atualizar</>)}
          </ButtonAPP>
        </div>
      </div>

      {/* Componente que exibe todos os pedidos */}
      <OrdersGrid/>
    </div>
  )
}