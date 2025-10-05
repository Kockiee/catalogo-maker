/**
 * CONTEXTO DE FERRAMENTAS
 * 
 * Este arquivo contém o contexto de ferramentas que gerencia os dados
 * principais do dashboard, incluindo catálogos e pedidos do usuário.
 * Fornece funções para buscar e atualizar esses dados.
 * 
 * Funcionalidades:
 * - Gerenciamento de catálogos do usuário
 * - Gerenciamento de pedidos do usuário
 * - Atualização de catálogos
 * - Atualização de pedidos
 * - Integração com API do backend
 * - Autenticação com token
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { createContext, useContext, useEffect, useState } from "react"; // Importa hooks do React

// Cria o contexto de ferramentas
const ToolContext = createContext();

export const ToolProvider = ({children, user}) => {
    // Estado para armazenar catálogos do usuário
    const [catalogs, setCatalogs] = useState(false);
    // Estado para armazenar pedidos do usuário
    const [orders, setOrders] = useState(false);

    // Função para atualizar lista de catálogos
    const updateCatalogs = async () => {
      const response = await fetch(`/api/catalogs/get-catalogs/${user.uid}`, {
          headers: {
            'Authorization': await user.getIdToken() // Envia token de autenticação
          }
        });
      const data = await response.json(); // Converte resposta para JSON
      setCatalogs(data); // Atualiza estado com catálogos
    };

    // Função para atualizar lista de pedidos
    const updateOrders = async () => {
      const response =  await fetch(`/api/orders/get-orders/${user.uid}`, {
        headers: {
          'Authorization': await user.getIdToken() // Envia token de autenticação
        }
      });
      const data = await response.json(); // Converte resposta para JSON
      setOrders(data); // Atualiza estado com pedidos
    }

    // Efeito para carregar catálogos e pedidos quando o componente monta
    useEffect(() => {
      updateCatalogs(); // Carrega catálogos
      updateOrders(); // Carrega pedidos
    }, []);

    // Objeto com todos os valores e funções do contexto
    const context = {
        catalogs, // Array de catálogos do usuário
        orders, // Array de pedidos do usuário
        updateCatalogs, // Função para atualizar catálogos
        updateOrders // Função para atualizar pedidos
    };

    return <ToolContext.Provider value={context}>{children}</ToolContext.Provider>
};

// Hook personalizado para usar o contexto de ferramentas
export const useTool = () => {
  return useContext(ToolContext); // Retorna o contexto
};
