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
import Notification from '@/app/components/Notification';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function OrdersGrid() {
    const { orders, updateOrders, catalogs } = useTool();
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [showCancelationForm, setShowCancelationForm] = useState(false);
    const [notification, setNotification] = useState(<></>);

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
            return <div key={index} className="text-sm rounded border-lightcyan border-4 bg-white m-2 flex flex-wrap w-full">
                {showCancelationForm && (
                    <div className='fixed z-20 w-full bg-periwinkle h-full top-16 max-md:px-4 right-0 flex flex-col items-center'>
                        <div className='bg-white !border-4 !border-lightcyan p-4 rounded max-w-lg max-md:max-w-full w-full shadow relative'>
                            <button className='absolute top-2 right-2' onClick={() => setShowCancelationForm(false)}>
                                <HiX className='w-6 h-6 text-gray-500'/>
                            </button>
                            <form
                            className='flex flex-col'
                            onSubmit={async() => {
                                setNotification(<Notification setPattern={setNotification} type="error" message="Pedido cancelado com sucesso."/>)
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
                    <div className="flex justify-between w-full mb-4">
                        <h1 className="font-bold text-base">{order.buyer_name}</h1>
                        <div className='inline-flex'>
                            <p className={`flex items-center justify-center p-1.5 rounded-full text-xs text-white text-center ${order.status === 'waiting-accept' ? 'bg-red-500' : 'bg-green-500'}`}>{order.status === 'waiting-accept' ? "Aguardando aceitação" : "Processado"}</p>
                            <button className='pl-2 py-2' onClick={() => toggleMenu(index)}> {/* Adicionando onClick para abrir menu */}
                                <CiMenuKebab className='w-7 h-7'/>
                            </button>
                        </div>
                    </div>
                    {openMenuIndex === index && (
                        <div className="bg-white flex flex-col z-10 top-16 right-0 absolute border border-gray-200 mt-2 py-2 rounded-md shadow-lg">
                            <button className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setShowCancelationForm(true)}>Cancelar</button>
                        </div>
                    )}
                    <p className="font-bold">Valor: {order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    {expandedOrders.includes(index) && (
                        <div className="flex flex-wrap" id={`order-${index}`}>
                            <p className='p-1 w-full'>Feito no catálogo: {order.catalog_name}</p>
                            <Tooltip placement='right' content="Clique para ir ao WhatsApp">
                                <p className='p-1 w-full'>Telefone do comprador: 
                                    <a 
                                    className='underline underline-offset-2 decoration-2 decoration-jordyblue hover:decoration-neonblue decoration-dashed' 
                                    href={`https://api.whatsapp.com/send/?phone=${order.buyer_phone}&text=Olá, tenho informações sobre a sua venda&type=phone_number&app_absent=0`} 
                                    target='_blank'>
                                        {formatPhoneNumber(order.buyer_phone)}
                                    </a>
                                </p>
                            </Tooltip>
                            <p className='p-1 w-full'>Criado em: {new Date(order.created_at.seconds * 1000).toLocaleString()}</p>
                            <div className='w-full my-2'>
                                {order.content.map((product, index) => (
                                    <div className='flex flex-row p-1' key={index}>
                                        <img src={product.images[0]} alt={`Imagem de ${product.name}`} className='size-16' />
                                        <div className='flex-col text-sm ml-2'>
                                            <p className='font-bold'>{product.name} <span className='font-medium'> x {product.quantity}</span></p>
                                            {product.variations.map((variation, index) => (
                                                <p key={index}>{variation.name}: {variation.variants}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {order.status === 'waiting-accept' ? (
                        <div className='flex flex-wrap max-lg:space-y-2 max-lg:space-x-0 space-x-2 w-full'>
                            <Button
                            onClick={async() => {
                                await refuseOrder(order.id)
                                await updateOrders()
                            }}
                            size='md' 
                            className='duration-200 focus:!ring-jordyblue bg-transparent w-[49%] max-lg:w-full border-neonblue border-2 text-neonblue hover:text-white hover:!bg-neonblue'>
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
                            className='duration-200 focus:!ring-jordyblue w-[49%] max-lg:w-full bg-neonblue hover:!bg-neonblue/80 text-white'>
                                Aceitar pedido
                            </Button>
                        </div>
                    ) : (
                        <a 
                        href={`https://api.whatsapp.com/send/?phone=${order.buyer_phone}&text=Ei, vamos prosseguir com o pedido ?&type=phone_number&app_absent=0`}
                        target='_blank'>
                            <Button
                            size='md' 
                            className='duration-200 focus:!ring-jordyblue w-full bg-neonblue hover:!bg-neonblue/80 text-white'>
                                Prosseguir no Whatsapp <FaWhatsapp className='ml-1 w-6 h-6'/>
                            </Button>
                        </a>
                    )}
                </div>
                <button
                    className="duration-200 bg-gray-200 p-1 w-full flex justify-center hover:bg-gray-300"
                    onClick={() => toggleOrder(index)}
                >
                    {expandedOrders.includes(index) ? <HiChevronUp className="w-6 h-6"/> : <HiChevronDown className="w-6 h-6"/>}
                </button>
            </div>
        });
    }

    return (
        <div className="flex flex-wrap">
            {orders ? renderOrders() : <p className="text-center w-full">*Você ainda não recebeu nenhum pedido*</p>}
            {notification}
        </div>
    )
}
