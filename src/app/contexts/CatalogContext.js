'use client' // Diretiva para indicar que este código executa no cliente

// Importação de hooks do React necessários para o contexto
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Contexto para gerenciamento do catálogo e carrinho de compras
 * Fornece funcionalidades para adicionar/remover produtos do carrinho e controlar sua visibilidade
 * Os dados do carrinho são persistidos no localStorage do navegador
 */
const CatalogContext = createContext();

/**
 * Provedor do contexto que disponibiliza as funcionalidades de catálogo para a aplicação
 * Gerencia o estado global do carrinho de compras e suas operações
 * @param {React.ReactNode} children - Componentes filhos que terão acesso ao contexto
 * @returns {JSX.Element} Provedor do contexto com funcionalidades de catálogo
 */
export const CatalogProvider = ({children}) => {
    // Estado para armazenar os produtos no carrinho de compras
    // Cada item contém: produto, variações selecionadas e quantidade
    const [cart, setCart] = useState([]);
    // Estado para controlar se o usuário está visualizando o carrinho
    const [viewingCart, setViewingCart] = useState(false)

    /**
     * Função para atualizar o carrinho a partir do localStorage
     * Carrega os dados salvos e atualiza o estado do carrinho
     * Usada para sincronizar o estado com dados persistidos
     */
    const updateCart = () => {
        const storagedCart = localStorage.getItem('cart');  // Obtém dados do localStorage
        const cartArray = JSON.parse(storagedCart);         // Converte string JSON para array
        setCart(cartArray || []);                          // Atualiza estado (array vazio se null)
    }

    /**
     * Efeito para carregar o carrinho do localStorage quando o componente é montado
     * Garante que o carrinho seja carregado automaticamente na inicialização
     */
    useEffect(() => {
        updateCart();  // Carrega dados do localStorage na montagem do componente
    }, []) // Array de dependências vazio = executa apenas na montagem

    /**
     * Função para adicionar um produto ao carrinho de compras
     * Verifica se o produto com as mesmas variações já existe e trata adequadamente
     * @param {Object} product - Objeto do produto a ser adicionado
     * @param {Array} variations - Array com as variações selecionadas (cor, tamanho, etc.)
     */
    const addProductToCatalog = (product, variations) => {
        const storagedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Verifica se o produto com as mesmas variações já existe no carrinho
        // Compara ID do produto e string das variações para identificar itens únicos
        const existingProductIndex = storagedCart.findIndex(item =>
            item.id === product.id && item.variations.toString() === variations.toString()
        );

        if (existingProductIndex !== -1) {
            // Se o produto já existe com as mesmas variações, incrementa a quantidade
            storagedCart[existingProductIndex].quantity += 1;
        } else {
            // Se o produto não existe, adiciona como novo item com quantidade 1
            storagedCart.push({
                ...product,    // Copia todas as propriedades do produto
                variations,    // Adiciona as variações selecionadas
                quantity: 1    // Define quantidade inicial
            });
        }

        // Atualiza o localStorage com o novo estado do carrinho
        localStorage.setItem('cart', JSON.stringify(storagedCart));
        // Atualiza o estado do contexto para refletir mudanças na interface
        setCart(storagedCart);
    };

    /**
     * Função para remover um produto do carrinho de compras
     * Decrementa quantidade ou remove item completamente se quantidade for 1
     * @param {string} productId - ID único do produto a ser removido
     * @param {Array} variations - Array com as variações do produto
     */
    const removeProductFromCatalog = (productId, variations) => {
        let storagedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Encontra o índice do produto com as mesmas variações
        const existingProductIndex = storagedCart.findIndex(item =>
            item.id === productId && item.variations.toString() === variations.toString()
        );

        if (existingProductIndex !== -1) {
            if (storagedCart[existingProductIndex].quantity > 1) {
                // Se a quantidade for maior que 1, apenas decrementa
                storagedCart[existingProductIndex].quantity -= 1;
            } else {
                // Se a quantidade for 1, remove o produto completamente do carrinho
                storagedCart = storagedCart.filter(item =>
                    !(item.id === productId && item.variations.toString() === variations.toString())
                );
            }
        }

        // Atualiza o localStorage com o carrinho modificado
        localStorage.setItem('cart', JSON.stringify(storagedCart));
        // Atualiza o estado do contexto
        setCart(storagedCart);
    };

    /**
     * Objeto com todos os valores e funções que serão disponibilizados pelo contexto
     * Este objeto é passado como value para o Provider e fica disponível em toda a árvore de componentes
     */
    const context = {
        cart,                        // Array com produtos no carrinho
        setCart,                     // Função para atualizar o carrinho diretamente
        viewingCart,                 // Estado de visibilidade do carrinho
        setViewingCart,              // Função para controlar visibilidade do carrinho
        addProductToCatalog,         // Função para adicionar produtos ao carrinho
        removeProductFromCatalog     // Função para remover produtos do carrinho
    };

    /**
     * Retorna o provedor do contexto com os valores e funções disponíveis para os componentes filhos
     * Todos os componentes dentro deste provider terão acesso aos dados e funções do carrinho
     */
    return <CatalogContext.Provider value={context}>{children}</CatalogContext.Provider>
};

/**
 * Hook personalizado para facilitar o uso do contexto em outros componentes
 * Fornece uma interface limpa para acessar as funcionalidades do catálogo
 * @returns {Object} Objeto contendo todas as funções e estados do contexto
 */
export const useCatalog = () => {
  return useContext(CatalogContext);
};