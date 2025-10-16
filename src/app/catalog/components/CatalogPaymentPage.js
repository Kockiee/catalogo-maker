/**
 * PÁGINA DE PAGAMENTO - FINALIZAÇÃO DE PEDIDO
 * 
 * Este arquivo contém o componente da página de finalização de compra,
 * onde o cliente preenche seus dados e confirma o pedido. Inclui
 * validação de dados, exibição do carrinho e processamento do pedido.
 * 
 * Funcionalidades:
 * - Exibe produtos do carrinho com quantidades
 * - Formulário para dados do cliente (nome e telefone)
 * - Validação de dados obrigatórios
 * - Cálculo do preço total
 * - Processamento e envio do pedido
 * - Tela de confirmação após envio
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
// Importa o hook de contexto do catálogo
import { useCatalog } from "@/app/contexts/CatalogContext";
// Importa componente de label do Flowbite
import { Label } from "flowbite-react";
// Importa componente de link do Next.js
import Link from "next/link";
// Importa hooks do React
import { useEffect, useState } from "react";
// Importa ícone de informação
import { HiInformationCircle } from "react-icons/hi";
// Importa componente de máscara de input
import InputMask from 'react-input-mask';
// Importa hook de estado do formulário
import { useFormState } from 'react-dom';
// Importa função de redirecionamento
import { redirect } from "next/navigation";
// Importa ação para criar pedido
import { createOrder } from "@/app/actions/createOrder";
// Importa ícone de verificação
import { MdVerified } from "react-icons/md";

// Componente da página de pagamento
export default function CatalogPaymentPage({catalog}) {
    // Extrai funções e estados do contexto do catálogo
    const { cart, setCart } = useCatalog()
    // Estado para mensagens de erro
    const [error, setError] = useState("");
    // Estado para controlar carregamento
    const [loading, setLoading] = useState(false);
    // Estado para nome completo do cliente
    const [fullName, setFullName] = useState('');
    // Estado para número de telefone
    const [phoneNumber, setPhoneNumber] = useState('');
    // Estado para controlar se pedido foi enviado
    const [orderInvited, setOrderInvited] = useState(false);

    // Redireciona se carrinho estiver vazio
    if (cart && cart.length < 1) redirect(`/catalog/${catalog.id}`)

    // Função que renderiza a lista de produtos do carrinho
    const renderProducts = () => {
        return cart.map((product, index) => (
            <div key={index} style={{backgroundColor: catalog.tertiary_color}} className="p-1 rounded flex flex-row">
                {/* Link para página do produto */}
                <Link href={`/catalog/${catalog.id}/${product.id}`}>
                    <div>
                        {/* Imagem do produto */}
                        <img src={product.images[0]} alt={product.name} className="size-20 rounded border"/>
                    </div>
                </Link>
                
                {/* Informações do produto */}
                <div className="flex flex-col p-2">
                    <Link href={`/catalog/${catalog.id}/${product.id}`}>
                        {/* Nome do produto */}
                        <h1 className="text-base font-medium">{product.name}</h1>
                        
                        {/* Lista as variações selecionadas */}
                        {product.variations.map((variation, index) => (
                            <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>
                                {variation.name}: {variation.variants}
                            </h2>
                        ))}
                        
                        {/* Quantidade do produto */}
                        <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>
                            Quantidade: {product.quantity}
                        </h2>
                        
                        {/* Preço total do item */}
                        <p className="text-sm font-bold">
                            {(product.price * product.quantity).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        </p>
                    </Link>
                </div>
            </div>
        ))
    }

    // Função que calcula o preço total do carrinho
    const calculateTotalPrice = () => {
        let total = 0;
        cart.forEach(product => {
            total += product.price * product.quantity; // Soma preço × quantidade de cada produto
        });
        return total;
    };

    // Calcula o preço total
    const totalPrice = calculateTotalPrice();

    // Hook para gerenciar estado do formulário e processar envio
    const [formState, formAction] = useFormState(async(state, formdata) => {
        
        // Valida se telefone tem 13 dígitos (formato brasileiro)
        if (phoneNumber.length !== 13) {
            setError("Seu telefone precisa ter 13 dígitos");
        } else {
            // Adiciona telefone aos dados do formulário
            formdata.set('buyerPhone', phoneNumber);
            // Cria o pedido usando a ação createOrder
            const createdOrder = await createOrder(state, formdata, catalog.id, catalog.name, catalog.store_name, catalog.owner, cart, totalPrice);
            // Limpa o carrinho
            setCart([]);
            // Remove carrinho do localStorage
            localStorage.setItem('cart', JSON.stringify([]));
            return createdOrder;           
        }
    }, {message: ''});

    // Efeito que processa o resultado do envio do formulário
    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false); // Para o carregamento
            if (formState.message === 'order-created') {
                setOrderInvited(true); // Mostra tela de sucesso
                setCart([]) // Limpa carrinho
                // Redireciona após 5 segundos
                setTimeout(() => {redirect(`/catalog/${catalog.id}`)}, 5000)
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas."); // Mostra erro
            }
        }
    }, [formState]);

    return (
        <>
        {/* Tela de sucesso após envio do pedido */}
        {orderInvited ? (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="flex flex-col items-center" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
                    {/* Ícone de verificação */}
                    <MdVerified className="w-32 h-32 text-green-400/50"/>
                    {/* Mensagem de sucesso */}
                    <p className="text-xl font-medium">Pedido enviado com sucesso !</p>
                </div>
            </div>
        ) : (
            /* Formulário de finalização de compra */
            <div>
                <form 
                onSubmit={() => setLoading(true)} // Inicia carregamento ao enviar
                action={(formdata) => formAction(formdata)} // Processa formulário
                className="flex flex-row max-md:flex-col-reverse mt-4">
                    
                    {/* Seção de dados do cliente */}
                    <div className="flex flex-col p-4 w-1/2 max-md:w-full rounded space-y-1 h-full" style={{backgroundColor: catalog.tertiary_color}} >
                        {/* Label e campo para nome completo */}
                        <Label
                        style={{color: catalog.text_color}}
                        htmlFor="buyerName"
                        value="Seu nome completo"
                        />
                        <input
                        name="buyerName"
                        maxLength={50} // Limita a 50 caracteres
                        placeholder="John Doe"
                        required // Campo obrigatório
                        value={fullName}
                        onChange={(e) => {
                            // Remove caracteres especiais, mantém apenas letras e espaços
                            e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, '');
                            setFullName(e.target.value);
                        }}
                        className="max-w-xs text-black rounded border-gray-500 focus:border-gray-500"
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.secondary_color}`} // Efeito de foco
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'} // Remove efeito ao sair do foco
                        type="text" 
                        />
                        
                        {/* Label e campo para telefone */}
                        <Label
                        style={{color: catalog.text_color}}
                        htmlFor="buyerPhone"
                        value="Seu número de telefone"
                        />
                        <InputMask
                        required // Campo obrigatório
                        name="buyerPhone"
                        placeholder="+55 (16) 12345-6789"
                        onChange={e => setPhoneNumber((e.target.value).replace(/\D/g, ''))} // Remove caracteres não numéricos
                        mask="+99 (99) 99999-9999" // Máscara para telefone brasileiro
                        className="max-w-xs text-black rounded border-gray-500 focus:border-gray-500"
                        onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.secondary_color}`} // Efeito de foco
                        onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'} // Remove efeito ao sair do foco
                        type="text"/>
                        
                        {/* Mensagem de erro se houver */}
                        <p className='text-red-500 text-sm'>{error}</p>
                        
                        {/* Informação sobre uso do telefone */}
                        <div className="!mt-4">
                            <p className="text-sm">
                                <HiInformationCircle className="w-6 h-6 inline-flex"/> 
                                Precisamos do seu número de telefone para te notificar quando seu pedido for aceito
                            </p>
                        </div>
                    </div>
                    
                    {/* Seção de resumo do pedido */}
                    <div className="w-1/2 max-md:w-full space-y-2 max-md:mb-4 max-md:ml-0 ml-6">
                        {/* Lista de produtos do carrinho */}
                        {renderProducts()}
                        
                        {/* Resumo do pedido */}
                        <div className="flex flex-col p-4 w-full rounded space-y-1 !mt-2" style={{backgroundColor: catalog.tertiary_color}}>
                            <h2>Total</h2>
                            {/* Preço total formatado em reais */}
                            <p className="text-2xl font-medium">{totalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                            <p className="text-sm">Tudo certo? Clique em finalizar enviar seu pedido ao vendedor</p>
                            
                            {/* Botão para finalizar compra */}
                            <button
                            aria-disabled={loading} // Acessibilidade para estado desabilitado
                            type="submit"
                            onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 3px ${catalog.primary_color}`} // Efeito de foco
                            onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'} // Remove efeito ao sair do foco
                            className="rounded mt-4 p-3.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full disabled:opacity-70" 
                            style={{backgroundColor: catalog.secondary_color}}
                            >
                                {/* Texto do botão muda conforme estado de carregamento */}
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