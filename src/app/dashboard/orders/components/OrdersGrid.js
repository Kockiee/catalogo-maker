/**
 * Componente de grade de pedidos do usuário
 * 
 * Este arquivo contém o componente que exibe todos os pedidos
 * recebidos pelo usuário em formato de cards expansíveis.
 * Permite gerenciar pedidos (aceitar, recusar, cancelar) e
 * interagir com clientes via WhatsApp.
 * 
 * Funcionalidades principais:
 * - Exibição de todos os pedidos do usuário
 * - Expansão/contração de detalhes dos pedidos
 * - Ações de aceitar, recusar e cancelar pedidos
 * - Integração com WhatsApp para comunicação
 * - Formulário de cancelamento com motivo
 * - Interface responsiva e intuitiva
 */

'use client'
// Importa hook useState do React
import { useState } from 'react';
// Importa ícones do Heroicons
import { HiChevronDown, HiChevronUp, HiTrash, HiX } from "react-icons/hi";
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importa componentes do Flowbite
import { Button, Label, Textarea, Tooltip } from 'flowbite-react';
// Importa ícone de menu kebab
import { CiMenuKebab } from 'react-icons/ci';
import CancelOrderModal from './CancelOrderModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
// Importa ações para gerenciar pedidos
import { acceptOrder } from '@/app/actions/acceptOrder';
import { cancelOrder } from '@/app/actions/cancelOrder';
import { refuseOrder } from '@/app/actions/refuseOrder';
// Importa função utilitária para formatação de telefone
import { formatPhoneNumber } from '@/app/utils/functions';
// Importa hook de notificações
import { useNotifications } from '@/app/hooks/useNotifications';
// Importa componente Link do Next.js
import Link from 'next/link';
// Importa ícone do WhatsApp
import { FaWhatsapp } from 'react-icons/fa';

// Componente principal da grade de pedidos
export default function OrdersGrid() {
    // Extrai pedidos, função de atualização e catálogos do contexto de ferramentas
    const { orders, updateOrders, catalogs } = useTool();
    const safeCatalogs = catalogs ?? [];
    // Estado que armazena os índices dos pedidos expandidos
    const [expandedOrders, setExpandedOrders] = useState([]);
    // Estado que controla qual menu de ações está aberto
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    // Estado que controla qual pedido tem o formulário de cancelamento aberto (id)
    const [cancelModalOrderId, setCancelModalOrderId] = useState(null);
    // Estado que controla qual pedido tem o modal de exclusão aberto (id)
    const [deleteModalOrderId, setDeleteModalOrderId] = useState(null);
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();

    // Função que alterna a expansão de um pedido específico
    const toggleOrder = (index) => {
        setExpandedOrders(prevState => {
            if (prevState.includes(index)) {
                // Se já está expandido, remove da lista
                return prevState.filter(item => item !== index);
            } else {
                // Se não está expandido, adiciona à lista
                return [...prevState, index];
            }
        });
    };

    // Função que alterna o menu de ações de um pedido
    const toggleMenu = (index) => {
        if (openMenuIndex === index) {
            // Se o menu já está aberto, fecha ele
            setOpenMenuIndex(null);
        } else {
            // Se o menu está fechado, abre ele
            setOpenMenuIndex(index);
        }
    };

    // Função que renderiza todos os pedidos
    const renderOrders = () => {
        return orders.map((order, index) => {
            // Encontra os dados do catálogo relacionado ao pedido
            const catalogData = safeCatalogs.find(catalog => catalog.id === order.catalog_id) ?? {};
            return <div key={index} className="text-sm rounded-lg border border-gray-200 bg-white shadow-sm m-2 flex flex-wrap w-full hover:shadow-md transition-shadow">
                {/* Modal de cancelamento de pedido */}
                {/* Cancel modal — render via component when open for this order */}
                <CancelOrderModal
                    open={cancelModalOrderId === order.id}
                    onClose={() => setCancelModalOrderId(null)}
                    order={order}
                    catalogData={catalogData}
                    notify={notify}
                    updateOrders={updateOrders}
                />
                {/* Container principal do pedido */}
                <div className="p-4 w-full relative">
                    {/* Header do pedido com informações básicas */}
                    <div className="flex justify-between w-full mb-4 items-start">
                        {/* Informações do comprador e valor */}
                        <div className="flex-1 min-w-0">
                            <h1 className="font-bold text-lg text-gray-800 truncate">{order.buyer_name}</h1>
                            <p className="text-sm text-gray-600 mt-1">Valor: {order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        {/* Status do pedido e menu de ações */}
                        <div className='flex items-center space-x-2 ml-4'>
                            {/* Badge de status do pedido */}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'waiting-accept' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {order.status === 'waiting-accept' ? "Aguardando" : "Processado"}
                            </span>
                            {/* Botão do menu de ações */}
                            {order.status !== 'waiting-accept' && (
                                <button 
                                    className='p-2 hover:bg-gray-100 rounded-full transition-colors' 
                                    onClick={() => toggleMenu(index)}
                                >
                                    <CiMenuKebab className='w-5 h-5 text-gray-500'/>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Menu de ações do pedido */}
                    {openMenuIndex === index && (
                        <div className="bg-white flex flex-col z-10 top-16 right-0 absolute border border-gray-200 mt-2 py-2 rounded-md shadow-lg min-w-[120px]">
                            {/* Botão para cancelar pedido */}
                            <button 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left flex items-center text-sm" 
                                onClick={() => setCancelModalOrderId(order.id)}
                            >
                                <HiX className='w-5 h-5 inline'/>Cancelar
                            </button>
                            <button 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left flex items-center text-sm" 
                                onClick={() => setDeleteModalOrderId(order.id)}
                            >
                                <HiTrash className='w-5 h-5 inline'/> Excluir
                            </button>
                            {/* Delete confirmation modal */}
                            <ConfirmDeleteModal
                                open={deleteModalOrderId === order.id}
                                onClose={() => setDeleteModalOrderId(null)}
                                order={order}
                                    onConfirm={async () => {
                                    await refuseOrder(order, null, false);
                                    notify.success("Pedido excluído com sucesso.");
                                    await updateOrders();
                                }}
                            />
                        </div>
                    )}
                    {/* Detalhes expandidos do pedido */}
                    {expandedOrders.includes(index) && (
                        <div className="mt-4 space-y-4" id={`order-${index}`}>
                            {/* Grid com informações básicas do pedido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nome do catálogo */}
                                <div>
                                    <p className="text-sm text-gray-600">Catálogo:</p>
                                    <p className="font-medium">{order.catalog_name}</p>
                                </div>
                                {/* Data de criação do pedido */}
                                <div>
                                    <p className="text-sm text-gray-600">Criado em:</p>
                                    <p className="font-medium">{new Date(order.created_at.seconds * 1000).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            {/* Telefone do comprador com link para WhatsApp */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Telefone do comprador:</p>
                                <Tooltip placement='right' content="Clique para ir ao WhatsApp">
                                    <a 
                                        className='inline-flex items-center text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-2 decoration-blue-300 hover:decoration-blue-500 decoration-dashed' 
                                        href={`https://api.whatsapp.com/send/?phone=${order.buyer_phone}&text=Olá, tenho informações sobre a sua venda&type=phone_number&app_absent=0`} 
                                        target='_blank'
                                    >
                                        {formatPhoneNumber(order.buyer_phone)}
                                    </a>
                                </Tooltip>
                            </div>
                            
                            {/* Lista de produtos do pedido */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Produtos:</p>
                                <div className="space-y-3">
                                    {/* Mapeia cada produto do pedido */}
                                    {order.content.map((product, productIndex) => (
                                        <div className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg' key={productIndex}>
                                            {/* Imagem do produto */}
                                            <img 
                                                src={product.images[0]} 
                                                alt={`Imagem de ${product.name}`} 
                                                className='w-16 h-16 object-cover rounded-md flex-shrink-0' 
                                            />
                                            {/* Informações do produto */}
                                            <div className='flex-1 min-w-0'>
                                                {/* Nome e quantidade do produto */}
                                                <p className='font-bold text-sm'>{product.name} <span className='font-medium text-gray-600'>x {product.quantity}</span></p>
                                                {/* Variações do produto */}
                                                {product.variations.map((variation, varIndex) => (
                                                    <p key={varIndex} className="text-xs text-gray-600 mt-1">
                                                        {variation.name}: {variation.variants}
                                                    </p>
                                                ))}
                                                <p className='text-sm text-gray-800 mt-1 font-medium'>Subtotal: { (product.price * product.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Botões de ação do pedido */}
                    <div className="mt-4">
                        {/* Se o pedido está aguardando aceitação */}
                        {order.status === 'waiting-accept' ? (
                            <div className='flex flex-col sm:flex-row gap-2 w-full'>
                                {/* Botão para recusar pedido */}
                                <Button
                                    onClick={async() => {
                                        await refuseOrder(order, {
                                            id: catalogData?.whatsapp_session, 
                                            token: catalogData?.whatsapp_session_token
                                        }) // Recusa o pedido
                                        await updateOrders() // Atualiza a lista
                                    }}
                                    size='md'
                                    className='duration-200 focus:!ring-jordyblue bg-transparent flex-1 border-red-500 border-2 text-red-500 hover:text-white hover:!bg-red-500'>
                                    Recusar pedido
                                </Button>
                                {/* Botão para aceitar pedido */}
                                <Button
                                    onClick={async() => {
                                        await acceptOrder(order, {
                                            id: catalogData?.whatsapp_session, 
                                            token: catalogData?.whatsapp_session_token
                                        }); // Aceita o pedido
                                        await updateOrders() // Atualiza a lista
                                    }}
                                    size='md' 
                                    className='duration-200 focus:!ring-jordyblue flex-1 bg-green-500 hover:!bg-green-600 text-white'>
                                    Aceitar pedido
                                </Button>
                            </div>
                        ) : (
                            /* Se o pedido já foi aceito, mostra botão para prosseguir no WhatsApp */
                            <a 
                                href={`https://api.whatsapp.com/send/?phone=${order.buyer_phone}&text=Ei, vamos prosseguir com o pedido ?&type=phone_number&app_absent=0`}
                                target='_blank'
                                className="block"
                            >
                                <Button
                                    size='md' 
                                    className='duration-200 focus:!ring-jordyblue w-full bg-green-500 hover:!bg-green-600 text-white'>
                                    Prosseguir no Whatsapp <FaWhatsapp className='ml-2 w-5 h-5'/>
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
                {/* Botão para expandir/contrair detalhes do pedido */}
                <button
                    className="duration-200 bg-gray-100 p-3 w-full flex justify-center items-center hover:bg-gray-200 border-t border-gray-200 text-gray-600 hover:text-gray-800"
                    onClick={() => toggleOrder(index)}
                >
                    {/* Texto do botão que muda conforme o estado */}
                    <span className="text-sm font-medium mr-2">
                        {expandedOrders.includes(index) ? 'Ocultar detalhes' : 'Ver detalhes'}
                    </span>
                    {/* Ícone que muda conforme o estado */}
                    {expandedOrders.includes(index) ? <HiChevronUp className="w-5 h-5"/> : <HiChevronDown className="w-5 h-5"/>}
                </button>
            </div>
        });
    }

    return (
        <div className="space-y-4">
            {/* Se há pedidos, renderiza a lista */}
            {orders && orders.length > 0 ? (
                renderOrders()
            ) : (
                /* Se não há pedidos, mostra mensagem de estado vazio */
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">Você ainda não recebeu nenhum pedido</p>
                    <p className="text-gray-400 text-sm mt-2">Os pedidos aparecerão aqui quando os clientes fizerem compras</p>
                </div>
            )}
        </div>
    )
}
