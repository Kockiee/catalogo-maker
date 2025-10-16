/**
 * CONTEXTO DE CATÁLOGO
 * 
 * Este arquivo contém o contexto do catálogo que gerencia o carrinho de compras
 * dos clientes. Permite adicionar, remover e visualizar produtos no carrinho,
 * com persistência em localStorage.
 * 
 * Funcionalidades:
 * - Gerenciamento de carrinho de compras
 * - Adicionar produtos ao carrinho
 * - Remover produtos do carrinho
 * - Controle de quantidade de produtos
 * - Persistência em localStorage
 * - Suporte a variações de produtos
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { createContext, useContext, useEffect, useState } from "react"; // Importa hooks do React

// Cria o contexto do catálogo
const CatalogContext = createContext();

export const CatalogProvider = ({children}) => {
    // Estado do carrinho de compras
    const [cart, setCart] = useState([]);
    // Estado para controlar se está visualizando o carrinho
    const [viewingCart, setViewingCart] = useState(false)

    // Função para atualizar o carrinho a partir do localStorage
    const updateCart = () => {
        const storagedCart = localStorage.getItem('cart'); // Obtém carrinho do localStorage
        const cartArray = JSON.parse(storagedCart); // Converte string para array
        setCart(cartArray || []); // Define o carrinho ou array vazio
    }

    // Efeito para carregar o carrinho quando o componente monta
    useEffect(() => {
        updateCart(); // Carrega carrinho do localStorage
    }, [])

    // Função para adicionar produto ao carrinho
    const addProductToCatalog = (product, variations) => {
        const storagedCart = JSON.parse(localStorage.getItem('cart')) || []; // Obtém carrinho atual
        // Função para comparar variações profundamente
        const areVariationsEqual = (a, b) => {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
            // Ordena para garantir comparação independente da ordem
            const sortFn = (v) => v.name + ':' + v.variants;
            const aSorted = [...a].sort((x, y) => sortFn(x).localeCompare(sortFn(y)));
            const bSorted = [...b].sort((x, y) => sortFn(x).localeCompare(sortFn(y)));
            return aSorted.every((v, i) => v.name === bSorted[i].name && v.variants === bSorted[i].variants);
        };

        // Busca produto existente com as mesmas variações (comparação profunda)
        const existingProductIndex = storagedCart.findIndex(item => item.id === product.id && areVariationsEqual(item.variations, variations));

        if (existingProductIndex !== -1) { // Se produto já existe no carrinho
            storagedCart[existingProductIndex].quantity += 1; // Incrementa quantidade
        } else { // Se produto não existe no carrinho OU variações são diferentes
            storagedCart.push({ ...product, variations, quantity: 1 }); // Adiciona novo produto
        }

        localStorage.setItem('cart', JSON.stringify(storagedCart)); // Salva no localStorage
        setCart(storagedCart); // Atualiza estado
    };
    
    // Função para remover produto do carrinho
    const removeProductFromCatalog = (productId, variations) => {
        let storagedCart = JSON.parse(localStorage.getItem('cart')) || []; // Obtém carrinho atual
        // Função para comparar variações profundamente
        const areVariationsEqual = (a, b) => {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
            const sortFn = (v) => v.name + ':' + v.variants;
            const aSorted = [...a].sort((x, y) => sortFn(x).localeCompare(sortFn(y)));
            const bSorted = [...b].sort((x, y) => sortFn(x).localeCompare(sortFn(y)));
            return aSorted.every((v, i) => v.name === bSorted[i].name && v.variants === bSorted[i].variants);
        };

        // Busca produto existente com as mesmas variações (comparação profunda)
        const existingProductIndex = storagedCart.findIndex(item => item.id === productId && areVariationsEqual(item.variations, variations));

        if (existingProductIndex !== -1) { // Se produto existe no carrinho
            if (storagedCart[existingProductIndex].quantity > 1) { // Se quantidade maior que 1
                storagedCart[existingProductIndex].quantity -= 1; // Decrementa quantidade
            } else { // Se quantidade é 1
                // Remove completamente o produto do carrinho
                storagedCart = storagedCart.filter(item => !(item.id === productId && areVariationsEqual(item.variations, variations)));
            }
        }

        localStorage.setItem('cart', JSON.stringify(storagedCart)); // Salva no localStorage
        setCart(storagedCart); // Atualiza estado
    };

    // Objeto com todos os valores e funções do contexto
    const context = {
        cart, // Array de produtos no carrinho
        setCart, // Função para definir carrinho
        viewingCart, // Se está visualizando o carrinho
        setViewingCart, // Função para definir visualização do carrinho
        addProductToCatalog, // Função para adicionar produto
        removeProductFromCatalog // Função para remover produto
    };

    return <CatalogContext.Provider value={context}>{children}</CatalogContext.Provider>
};

// Hook personalizado para usar o contexto do catálogo
export const useCatalog = () => {
  return useContext(CatalogContext); // Retorna o contexto
};
