import OrdersGrid from "@/app/dashboard/orders/components/OrdersGrid";

export default function PAGE () {
  return (
    <div className="flex-col space-y-2 ">
      <h1 className="text-3xl font-bold">Seus pedidos</h1>
      <OrdersGrid/>
    </div>
  )
}