/**
 * CatalogPaymentPage.jsx
 * 
 * Este componente é uma página de finalização de compra (checkout) de um catálogo no Next.js.
 * Ele permite que o usuário veja os produtos no carrinho, insira seu nome e telefone, e finalize o pedido.
 * Inclui validação de telefone, cálculo de preço total e exibição de confirmação de pedido.
 */

'use client' // Indica que este componente será renderizado no lado do cliente (client-side) no Next.js

// Importa hooks e contextos necessários
import { useCatalog } from "@/app/contexts/CatalogContext"; // Acessa carrinho e funções do catálogo
import { Label } from "flowbite-react"; // Componente Label estilizado para inputs
import Link from "next/link"; // Para navegação entre páginas
import { useEffect, useState } from "react"; // Hooks do React
import { HiInformationCircle } from "react-icons/hi"; // Ícone de informação
import InputMask from 'react-input-mask'; // Para aplicar máscara em campos de input (ex: telefone)
import { useFormState } from 'react-dom'; // Hook para gerenciar estado do formulário no Next.js
import { redirect } from "next/navigation"; // Redireciona para outra página
import { createOrder } from "@/app/actions/createOrder"; // Função que cria o pedido no backend
import { MdVerified } from "react-icons/md"; // Ícone de verificação (sucesso)

// Componente principal da página de pagamento
export default function CatalogPaymentPage({catalog}) {
    // Acessa o carrinho e a função para atualizá-lo
    const { cart, setCart } = useCatalog();

    // Estados locais para controlar erros, loading e dados do comprador
    const [error, setError] = useState(""); // Mensagem de erro
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [fullName, setFullName] = useState(''); // Nome completo do comprador
    const [phoneNumber, setPhoneNumber] = useState(''); // Telefone do comprador
    const [orderInvited, setOrderInvited] = useState(false); // Indica se pedido foi enviado com sucesso

    // Se o carrinho estiver vazio, redireciona de volta para a página do catálogo
    if (cart && cart.length < 1) redirect(`/catalog/${catalog.id}`);

    // Função que renderiza os produtos do carrinho
    const renderProducts = () => {
        return cart.map((product, index) => (
            <div key={index} style={{backgroundColor: catalog.tertiary_color}} className="p-1 rounded flex flex-row">
                <Link href={`/catalog/${catalog.id}/${product.id}`}>
                    <div>
                        {/* Imagem do produto */}
                        <img src={product.images[0]} alt={product.name} className="size-20 rounded border"/>
                    </div>
                </Link>
                <div className="flex flex-col p-2">
                    <Link href={`/catalog/${catalog.id}/${product.id}`}>
                        {/* Nome do produto */}
                        <h1 className="text-base font-medium">{product.name}</h1>
                        {/* Lista variações do produto */}
                        {product.variations.map((variation, index) => (
                            <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>
                                {variation.name}: {variation.variants}
                            </h2>
                        ))}
                        {/* Quantidade escolhida */}
                        <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>
                            Quantidade: {product.quantity}
                        </h2>
                        {/* Preço total do produto (quantidade * preço unitário) */}
                        <p className="text-sm font-bold">
                            {(product.price * product.quantity).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        </p>
                    </Link>
                </div>
            </div>
        ));
    };

    // Calcula o preço total do carrinho
    const calculateTotalPrice = () => {
        let total = 0;
        cart.forEach(product => {
            total += product.price * product.quantity; // Soma preço unitário vezes quantidade
        });
        return total;
    };

    const totalPrice = calculateTotalPrice(); // Armazena o total do carrinho

    // Hook para lidar com envio do formulário de finalização
    const [formState, formAction] = useFormState(async(state, formdata) => {
        // Valida telefone (deve ter 13 dígitos)
        if (phoneNumber.length !== 13) {
            setError("Seu telefone precisa ter 13 dígitos");
        } else {
            // Adiciona telefone ao formdata
            formdata.set('buyerPhone', phoneNumber);
            // Cria pedido no backend
            const createdOrder = await createOrder(
                state, formdata, catalog.id, catalog.name, catalog.store_name, catalog.owner, cart, totalPrice
            );
            // Limpa carrinho local e no estado
            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));
            return createdOrder;           
        }
    }, {message: ''});

    // Efeito que reage às mudanças do estado do formulário
    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false); // Para loading
            if (formState.message === 'order-created') {
                // Pedido criado com sucesso
                setOrderInvited(true);
                setCart([]);
                // Redireciona de volta ao catálogo após 5 segundos
                setTimeout(() => {redirect(`/catalog/${catalog.id}`)}, 5000);
            } else if (formState.message === 'invalid-params') {
                // Erro: dados inválidos
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);

    // JSX principal da página
    return (
        <>
        {orderInvited ? (
            // Tela de sucesso após envio do pedido
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="flex flex-col items-center" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
                    <MdVerified className="w-32 h-32 text-green-400/50"/>
                    <p className="text-xl font-medium">Pedido enviado com sucesso !</p>
                </div>
            </div>
        ) : (
            // Tela padrão de checkout
            <div>
                <form 
                onSubmit={() => setLoading(true)} // Marca estado de loading ao enviar
                action={(formdata) => formAction(formdata)} // Chama ação assíncrona para criar pedido
                className="flex flex-row max-md:flex-col-reverse mt-4">
                    {/* Área do comprador: nome e telefone */}
                    <div className="flex flex-col p-4 w-1/2 max-md:w-full rounded space-y-1 h-full" style={{backgroundColor: catalog.tertiary_color}} >
                        <Label style={{color: catalog.text_color}} htmlFor="buyerName" value="Seu nome completo"/>
                        <input
                        name="buyerName"
                        maxLength={50}
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => {
                            // Permite apenas letras e espaços
                            e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, '');
                            setFullName(e.target.value);
                        }}
                        className="max-w-xs text-black rounded border-gray-500 focus:border-gray-500"
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.secondary_color}`}
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                        type="text" 
                        />
                        <Label style={{color: catalog.text_color}} htmlFor="buyerPhone" value="Seu número de telefone"/>
                        <InputMask
                        required
                        name="buyerPhone"
                        placeholder="+55 (16) 12345-6789"
                        onChange={e => setPhoneNumber((e.target.value).replace(/\D/g, ''))} // Remove caracteres não numéricos
                        mask="+99 (99) 99999-9999"
                        className="max-w-xs text-black rounded border-gray-500 focus:border-gray-500"
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.secondary_color}`}
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                        type="text"/>
                        <p className='text-red-500 text-sm'>{error}</p> {/* Mensagem de erro */}
                        <div className="!mt-4">
                            <p className="text-sm"><HiInformationCircle className="w-6 h-6 inline-flex"/> Precisamos do seu número de telefone para te notificar quando seu pedido for aceito</p>
                        </div>
                    </div>
                    {/* Área lateral: produtos e botão de finalizar */}
                    <div className="w-1/2 max-md:w-full space-y-2 max-md:mb-4 max-md:ml-0 ml-6">
                        {renderProducts()} {/* Lista produtos do carrinho */}
                        <div className="flex flex-col p-4 w-full rounded space-y-1 !mt-2" style={{backgroundColor: catalog.tertiary_color}}>
                            <h2>Total</h2>
                            <p className="text-2xl font-medium">
                                {totalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} {/* Valor total do carrinho */}
                            </p>
                            <p className="text-sm">Tudo certo? Clique em finalizar enviar seu pedido ao vendedor</p>
                            <button
                            aria-disabled={loading}
                            type="submit"
                            onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 3px ${catalog.primary_color}`}
                            onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'}
                            className="rounded mt-4 p-3.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full disabled:opacity-70" 
                            style={{backgroundColor: catalog.secondary_color}}
                            >
                                {loading ? "Finalizando compra..." : "Finalizar compra"} {/* Texto do botão dependendo do estado */}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )}
        </>
    )
}
