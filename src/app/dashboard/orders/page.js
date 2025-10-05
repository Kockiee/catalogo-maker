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

// Importa componente que exibe a grade de pedidos
import OrdersGrid from "@/app/dashboard/orders/components/OrdersGrid";

// Componente principal da página de pedidos
export default function PAGE () {
  return (
    <div className="flex-col space-y-2 ">
      {/* Título da página */}
      <h1 className="text-3xl font-bold">Seus pedidos</h1>
      {/* Componente que exibe todos os pedidos */}
      <OrdersGrid/>
    </div>
  )
}