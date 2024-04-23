'use client'
import { useCatalog } from "@/app/contexts/CatalogContext";
import { Label } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import InputMask from 'react-input-mask';
import { useFormState } from 'react-dom';
import { redirect } from "next/navigation";
import { createOrder } from "@/app/actions/createOrder";
import { MdVerified } from "react-icons/md";

export default function CatalogPaymentPage({catalog}) {
    const { cart, setCart } = useCatalog()
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [orderInvited, setOrderInvited] = useState(false);

    if (cart && cart.length < 1) redirect(`/catalog/${catalog.id}`)

    const renderProducts = () => {
        return cart.map((product, index) => (
            <div key={index} style={{backgroundColor: catalog.tertiary_color}} className="p-1 rounded flex flex-row">
                <Link href={`/catalog/${catalog.id}/${product.id}`}>
                    <div>
                        <img src={product.images[0]} alt={product.name} className="size-20 rounded border"/>
                    </div>
                </Link>
                <div className="flex flex-col p-2">
                    <Link href={`/catalog/${catalog.id}/${product.id}`}>
                        <h1 className="text-base font-medium">{product.name}</h1>
                        {product.variations.map((variation, index) => (
                            <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>{variation.name}: {variation.variants}</h2>
                        ))}
                        <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>Quantidade: {product.quantity}</h2>
                        <p className="text-sm font-bold">{(product.price * product.quantity).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    </Link>
                </div>
            </div>
        ))
    }

    const calculateTotalPrice = () => {
        let total = 0;
        cart.forEach(product => {
            total += product.price * product.quantity;
        });
        return total;
    };

    const totalPrice = calculateTotalPrice();

    const [formState, formAction] = useFormState(async(state, formdata) => {
        
        if (phoneNumber.length !== 13) {
            setError("Seu telefone precisa ter 13 dígitos");
        } else {
            formdata.set('buyerPhone', phoneNumber);
            const createdOrder = await createOrder(state, formdata, catalog.id, catalog.name, catalog.store_name, catalog.owner, cart, totalPrice);
            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));
            return createdOrder;           
        }
    }, {message: ''});

    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false);
            if (formState.message === 'order-created') {
                setOrderInvited(true);
                setCart([])
                setTimeout(() => {redirect(`/catalog/${catalog.id}`)}, 5000)
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);

    return (
        <>
        {orderInvited ? (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="flex flex-col items-center" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
                    <MdVerified className="w-32 h-32 text-green-400/50"/>
                    <p className="text-xl font-medium">Pedido enviado com sucesso !</p>
                </div>
            </div>
        ) : (
            <div>
                <form 
                onSubmit={() => setLoading(true)}
                action={(formdata) => formAction(formdata)}
                className="flex flex-row max-md:flex-col-reverse mt-4">
                    <div className="flex flex-col p-4 w-1/2 max-md:w-full rounded space-y-1 h-full" style={{backgroundColor: catalog.tertiary_color}} >
                        <Label
                        style={{color: catalog.text_color}}
                        htmlFor="buyerName"
                        value="Seu nome completo"
                        />
                        <input
                        name="buyerName"
                        maxLength={50}
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, '');
                            setFullName(e.target.value);
                        }}
                        className="max-w-xs text-black rounded border-gray-500 focus:border-gray-500"
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.secondary_color}`}
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                        type="text" 
                        />
                        <Label
                        style={{color: catalog.text_color}}
                        htmlFor="buyerPhone"
                        value="Seu número de telefone"
                        />
                        <InputMask
                        required
                        name="buyerPhone"
                        placeholder="+55 (16) 12345-6789"
                        onChange={e => setPhoneNumber((e.target.value).replace(/\D/g, ''))}
                        mask="+99 (99) 99999-9999"
                        className="max-w-xs text-black rounded border-gray-500 focus:border-gray-500"
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.secondary_color}`}
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                        type="text"/>
                        <p className='text-red-500 text-sm'>{error}</p>
                        <div className="!mt-4">
                            <p className="text-sm"><HiInformationCircle className="w-6 h-6 inline-flex"/> Precisamos do seu número de telefone para te notificar quando seu pedido for aceito</p>
                        </div>
                    </div>
                    <div className="w-1/2 max-md:w-full space-y-2 max-md:mb-4 max-md:ml-0 ml-6">
                        {renderProducts()}
                        <div className="flex flex-col p-4 w-full rounded space-y-1 !mt-2" style={{backgroundColor: catalog.tertiary_color}}>
                            <h2>Total</h2>
                            <p className="text-2xl font-medium">{totalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                            <p className="text-sm">Tudo certo? Clique em finalizar enviar seu pedido ao vendedor</p>
                            <button
                            aria-disabled={loading}
                            type="submit"
                            onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 3px ${catalog.primary_color}`}
                            onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                            className="rounded mt-4 p-3.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full disabled:opacity-70" 
                            style={{backgroundColor: catalog.secondary_color}}
                            >
                                {loading ? "Finalizando compra..." : "Finalizar compra"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )}
        </>
    )
}