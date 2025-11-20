import { Button, Label, Textarea } from 'flowbite-react';
import { cancelOrder } from '@/app/actions/cancelOrder';

export default function CancelOrderModal({ open, onClose, order, catalogData, notify, updateOrders }) {
  if (!open || !order) return null;

  return (
    <div className='fixed z-20 inset-0 flex items-center justify-center bg-black/40'>
      <div className='bg-white p-6 rounded shadow max-w-md w-full'>
        <h2 className='text-lg font-bold mb-2'>Cancelar pedido</h2>
        <p className='text-sm text-gray-600 mb-4'>Informe o motivo do cancelamento para o pedido <span className='break-all font-medium'>{order.id}</span>.</p>

        <form
          className='flex flex-col'
          onSubmit={async() => {
            notify?.success("Pedido cancelado com sucesso.");
            onClose();
            await updateOrders();
          }}
          action={async (formdata) => {
            await cancelOrder(formdata, order, {
              id: catalogData?.whatsapp_session,
              token: catalogData?.whatsapp_session_token,
            });
          }}
        >
          <Label htmlFor="reason" value="Motivo do cancelamento" />
          <Textarea
            type='text'
            rows={4}
            className='focus:ring-jordyblue focus:border-none focus:ring-2 mb-4'
            name="reason"
            placeholder="Fora de estoque"
            required
          />

          <div className='flex gap-2 justify-end'>
            <Button color="gray" onClick={onClose} type='button'>Fechar</Button>
            <Button color="failure" size='sm' type='submit'>Confirmar cancelamento</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
