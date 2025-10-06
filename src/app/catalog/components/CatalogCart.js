/**
 * COMPONENTE CARRINHO DE COMPRAS - CATÁLOGO
 * 
 * Este arquivo contém o componente do carrinho de compras que aparece
 * como um painel lateral deslizante. Permite visualizar, editar e
 * gerenciar os produtos adicionados ao carrinho.
 * 
 * Funcionalidades:
 * - Exibe produtos adicionados ao carrinho
 * - Permite aumentar/diminuir quantidade de produtos
 * - Remove produtos do carrinho
 * - Calcula preço total dos itens
 * - Botão para finalizar pedido
 * - Interface responsiva com animações
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
// Importa ícones do pacote react-icons
import { HiMinus, HiPlus, HiShoppingBag, HiX } from "react-icons/hi";
// Importa o hook de contexto do catálogo
import { useCatalog } from "../../contexts/CatalogContext"
// Importa hook de efeito do React
import { useEffect } from "react";
// Importa componente de link do Next.js
import Link from "next/link"

// Componente principal do carrinho de compras
export default function CatalogCart({catalog}) {
    // Extrai funções e estados do contexto do catálogo
    const { viewingCart, setViewingCart, cart, removeProductFromCatalog, addProductToCatalog } = useCatalog()
    
    // Efeito que abre o carrinho automaticamente quando há itens
    useEffect(() => {
        return () => setViewingCart(true); // Abre o carrinho quando há mudanças
    }, [cart]) // Executa quando o carrinho muda

    // Função que renderiza a lista de produtos no carrinho
    const renderProducts = () => {
        return cart.map((product, index) => (
            <div key={index} className="border p-1 rounded flex flex-row">
                {/* Link para a página do produto */}
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
                        
                        {/* Lista as variações selecionadas do produto */}
                        {product.variations.map((variation, index) => (
                            <h2 key={index} className="text-sm !opacity-80" style={{color: catalog.text_color}}>
                                {variation.name}: {variation.variants}
                            </h2>
                        ))}
                        
                        {/* Preço total do item (preço × quantidade) */}
                        <p className="text-sm font-bold">
                            {(product.price * product.quantity).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        </p>
                    </Link>
                    
                    {/* Controles de quantidade do produto */}
                    <div className="relative flex items-center max-w-[8rem] mt-2">
                        {/* Botão para diminuir quantidade */}
                        <button
                        onClick={() => removeProductFromCatalog(product.id, product.variations)}
                        type="button"
                        style={{backgroundColor: catalog.secondary_color}} 
                        className="hover:opacity-80 border border-gray-300 rounded-s-lg p-2 h-9">
                            <HiMinus/>
                        </button>

                        {/* Campo de input para mostrar quantidade (somente leitura) */}
                        <input 
                        value={product.quantity} 
                        type="text" 
                        id="quantity-input" 
                        className="bg-transparent focus:ring-0 focus:border-none border-x-0 border-gray-300 h-9 text-center text-sm block w-full py-2.5" 
                        required />

                        {/* Botão para aumentar quantidade */}
                        <button
                        onClick={() => addProductToCatalog(product, product.variations)}
                        type="button" 
                        style={{backgroundColor: catalog.secondary_color}} 
                        className="hover:opacity-80 border border-gray-300 rounded-e-lg p-2 h-9">
                            <HiPlus/>
                        </button>
                    </div>
                </div>
            </div>
        ))
    } 

    return (
        /* Container principal do carrinho com posicionamento fixo e animação */
        <div className={`max-w-sm w-full fixed top-0 right-0 z-20 transition-transform duration-300 ease-in-out transform ${viewingCart ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Painel interno do carrinho */}
            <div className="p-6 space-y-2 w-full h-full min-h-screen" style={{backgroundColor: catalog.tertiary_color}}>
                {/* Cabeçalho do carrinho */}
                <div className="flex justify-between mb-4">
                    {/* Título do carrinho com ícone */}
                    <h1 className="text-lg font-bold inline-flex items-center">
                        Seu carrinho <HiShoppingBag className="w-6 h-6 ml-1"/>
                    </h1>
                    {/* Botão para fechar o carrinho */}
                    <button onClick={() => setViewingCart(!viewingCart)} className="p-2">
                        <HiX className="w-7 h-7"/>
                    </button>
                </div>
                
                {/* Lista de produtos ou mensagem de carrinho vazio */}
                {cart.length > 0 ? renderProducts() : <p className="text-sm">Você ainda não adicionou nenhum item ao carrinho...</p>}
                
                {/* Link para página de pagamento */}
                <Link href={`/catalog/${catalog.id}/payment`}>
                    <button
                    disabled={cart.length === 0 ? true : false} // Desabilita se carrinho estiver vazio
                    onFocus={(event) => event.target.style.boxShadow = `0px 0px 0px 2px ${catalog.primary_color}`} // Efeito de foco
                    onBlur={(event) => event.target.style.boxShadow= '0px 0px 0px 0px'} // Remove efeito ao sair do foco
                    className="rounded mt-4 p-3.5 px-6 inline-flex items-center justify-center text-sm hover:opacity-80 w-full disabled:opacity-70" 
                    style={{backgroundColor: catalog.secondary_color}}
                    >
                        Finalizar pedido
                    </button>
                </Link>
            </div>
        </div>
    );
}