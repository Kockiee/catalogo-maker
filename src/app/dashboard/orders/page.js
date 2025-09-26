// Importação do componente de grid de pedidos
import OrdersGrid from "@/app/dashboard/orders/components/OrdersGrid";

/**
 * Página principal da seção de pedidos do dashboard
 * Exibe uma lista com todos os pedidos recebidos pelos catálogos
 * @returns {JSX.Element} Interface da página de pedidos
 */
export default function PAGE () {
  // Renderiza o layout da página de pedidos
  return (
    <div className="flex-col space-y-2 ">
      {/* Título da página */}
      <h1 className="text-3xl font-bold">Seus pedidos</h1>
      {/* Grid com lista de pedidos */}
      <OrdersGrid/>
    </div>
  )
}