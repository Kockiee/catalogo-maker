'use client'
import { useState } from 'react';
import { HiChevronDown, HiChevronUp, HiX } from "react-icons/hi";
import { useTool } from "@/app/contexts/ToolContext";
import { Button, Label, Textarea, Tooltip } from 'flowbite-react';
import { CiMenuKebab } from 'react-icons/ci';
import { acceptOrder } from '@/app/actions/acceptOrder';
import { cancelOrder } from '@/app/actions/cancelOrder';
import { refuseOrder } from '@/app/actions/refuseOrder';
import { formatPhoneNumber } from '@/app/utils/functions';
import { useNotifications } from '@/app/hooks/useNotifications';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function OrdersGrid() {
    const { orders, updateOrders, catalogs } = useTool();
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [showCancelationForm, setShowCancelationForm] = useState(false);
    const { notify } = useNotifications();

    const toggleOrder = (index) => {
        setExpandedOrders(prevState => {
            if (prevState.includes(index)) {
                return prevState.filter(item => item !== index);
            } else {
                return [...prevState, index];
            }
        });
    };

    const toggleMenu = (index) => {
        if (openMenuIndex === index) {
            setOpenMenuIndex(null);
        } else {
            setOpenMenuIndex(index);
        }
    };

    const renderOrders = () => {
        return orders.map((order, index) => {
            const catalogData = catalogs.find(catalog => catalog.id === order.catalog_id);
            return <div key={index} className="text-sm rounded-lg border border-gray-200 bg-white shadow-sm m-2 flex flex-wrap w-full hover:shadow-md transition-shadow">
                {showCancelationForm && (
                    <div className='fixed z-20 w-full bg-periwinkle h-full top-16 max-md:px-4 right-0 flex flex-col items-center'>
                        <div className='bg-white !border-4 !border-lightcyan p-4 rounded max-w-lg max-md:max-w-full w-full shadow relative'>
                            <button className='absolute top-2 right-2' onClick={() => setShowCancelationForm(false)}>
                                <HiX className='w-6 h-6 text-gray-500'/>
                            </button>
                            <form
                            className='flex flex-col'
                            onSubmit={async() => {
                                notify.success("Pedido cancelado com sucesso.");
                                setShowCancelationForm(false);
                                await updateOrders();
                            }}
                            action={async(formdata) => cancelOrder(formdata, order, {
                                id: catalogData.whatsapp_session, 
                                token: catalogData.whatsapp_session_token
                                })}>
                                <h1 className='text-lg font-bold mt-4'>Cancelamento do pedido <span className='break-all'>{order.id}</span></h1>
                                <Label
                                htmlFor="reason"
                                value="Motivo do cancelamento"
                                />
                                <Textarea
                                type='text'
                                rows={5}
                                className='focus:ring-jordyblue focus:border-none focus:ring-2'
                                name="reason"
                                placeholder="Fora de estoque"
                                required
                                />
                                <Button
                                size='sm'
                                type='submit'
                                className='duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full mt-2'
                                >
                                    Cancelar pedido
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
                <div className="p-4 w-full relative">
                    <div className="flex justify-between w-full mb-4 items-start">
                        <div className="flex-1 min-w-0">
                            <h1 className="font-bold text-lg text-gray-800 truncate">{order.buyer_name}</h1>
                            <p className="text-sm text-gray-600 mt-1">Valor: {order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div className='flex items-center space-x-2 ml-4'>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'waiting-accept' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {order.status === 'waiting-accept' ? "Aguardando" : "Processado"}
                            </span>
                            <button 
                                className='p-2 hover:bg-gray-100 rounded-full transition-colors' 
                                onClick={() => toggleMenu(index)}
                            >
                                <CiMenuKebab className='w-5 h-5 text-gray-500'/>
                            </button>
                        </div>
                    </div>
                    {openMenuIndex === index && (
                        <div className="bg-white flex flex-col z-10 top-16 right-0 absolute border border-gray-200 mt-2 py-2 rounded-md shadow-lg min-w-[120px]">
                            <button 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left text-sm" 
                                onClick={() => setShowCancelationForm(true)}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                    {expandedOrders.includes(index) && (
                        <div className="mt-4 space-y-4" id={`order-${index}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Catálogo:</p>
                                    <p className="font-medium">{order.catalog_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Criado em:</p>
                                    <p className="font-medium">{new Date(order.created_at.seconds * 1000).toLocaleString()}</p>
                                </div>
                            </div>
                            
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
                            
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Produtos:</p>
                                <div className="space-y-3">
                                    {order.content.map((product, productIndex) => (
                                        <div className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg' key={productIndex}>
                                            <img 
                                                src={product.images[0]} 
                                                alt={`Imagem de ${product.name}`} 
                                                className='w-16 h-16 object-cover rounded-md flex-shrink-0' 
                                            />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-bold text-sm'>{product.name} <span className='font-medium text-gray-600'>x {product.quantity}</span></p>
                                                {product.variations.map((variation, varIndex) => (
                                                    <p key={varIndex} className="text-xs text-gray-600 mt-1">
                                                        {variation.name}: {variation.variants}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-4">
                        {order.status === 'waiting-accept' ? (
                            <div className='flex flex-col sm:flex-row gap-2 w-full'>
                                <Button
                                    onClick={async() => {
                                        await refuseOrder(order.id)
                                        await updateOrders()
                                    }}
                                    size='md' 
                                    className='duration-200 focus:!ring-jordyblue bg-transparent flex-1 border-red-500 border-2 text-red-500 hover:text-white hover:!bg-red-500'>
                                    Recusar pedido
                                </Button>
                                <Button
                                    onClick={async() => {
                                        await acceptOrder(order, {
                                            id: catalogData.whatsapp_session, 
                                            token: catalogData.whatsapp_session_token
                                        });
                                        await updateOrders()
                                    }}
                                    size='md' 
                                    className='duration-200 focus:!ring-jordyblue flex-1 bg-green-500 hover:!bg-green-600 text-white'>
                                    Aceitar pedido
                                </Button>
                            </div>
                        ) : (
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
                <button
                    className="duration-200 bg-gray-100 p-3 w-full flex justify-center items-center hover:bg-gray-200 border-t border-gray-200 text-gray-600 hover:text-gray-800"
                    onClick={() => toggleOrder(index)}
                >
                    <span className="text-sm font-medium mr-2">
                        {expandedOrders.includes(index) ? 'Ocultar detalhes' : 'Ver detalhes'}
                    </span>
                    {expandedOrders.includes(index) ? <HiChevronUp className="w-5 h-5"/> : <HiChevronDown className="w-5 h-5"/>}
                </button>
            </div>
        });
    }

    return (
        <div className="space-y-4">
            {orders && orders.length > 0 ? (
                renderOrders()
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">Você ainda não recebeu nenhum pedido</p>
                    <p className="text-gray-400 text-sm mt-2">Os pedidos aparecerão aqui quando os clientes fizerem compras</p>
                </div>
            )}
        </div>
    )
}
