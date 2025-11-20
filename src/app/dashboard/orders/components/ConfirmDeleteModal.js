import { Button } from 'flowbite-react';

export default function ConfirmDeleteModal({ open, onClose, onConfirm, order }) {
  if (!open || !order) return null;

  return (
    <div className='fixed z-20 inset-0 flex items-center justify-center bg-black/40'>
      <div className='bg-white p-6 rounded shadow max-w-md w-full'>
        <h2 className='text-lg font-bold mb-2'>Confirmar exclusão</h2>
        <p className='text-sm text-gray-600 mb-4'>Tem certeza que deseja excluir o pedido <span className='break-all font-medium'>{order.id}</span>? Esta ação não pode ser desfeita.</p>

        <div className='flex gap-2 justify-end'>
          <Button color="gray" onClick={onClose}>Cancelar</Button>
          <Button color="failure" onClick={async () => { await onConfirm?.(); onClose(); }}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}
