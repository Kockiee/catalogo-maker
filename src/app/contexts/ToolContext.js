'use client' // Diretiva para indicar que este código executa no cliente

// Importação de hooks do React necessários para o contexto
import { createContext, useContext, useEffect, useState } from "react";

// Criação do contexto para gerenciamento de ferramentas (catálogos e pedidos)
const ToolContext = createContext();

// Provedor do contexto que disponibiliza as funcionalidades de ferramentas para a aplicação
export const ToolProvider = ({children, user}) => {
    // Estado para armazenar os catálogos do usuário
    const [catalogs, setCatalogs] = useState(false);
    // Estado para armazenar os pedidos do usuário
    const [orders, setOrders] = useState(false);

    // Função para atualizar os catálogos do usuário a partir da API
    const updateCatalogs = async () => {
      const response = await fetch(`/api/catalogs/get-catalogs/${user.uid}`, {
          headers: {
            'Authorization': await user.getIdToken()
          }
        });
      const data = await response.json();
      setCatalogs(data);
    };

    // Função para atualizar os pedidos do usuário a partir da API
    const updateOrders = async () => {
      const response =  await fetch(`/api/orders/get-orders/${user.uid}`, {
        headers: {
          'Authorization': await user.getIdToken()
        }
      });
      const data = await response.json();
      setOrders(data);
    }

    // Efeito para carregar os catálogos e pedidos quando o componente é montado
    useEffect(() => {
      updateCatalogs();
      updateOrders();
    }, []);

    // Objeto com todos os valores e funções que serão disponibilizados pelo contexto
    const context = {
        catalogs,
        orders,
        updateCatalogs,
        updateOrders
    };

    // Retorna o provedor do contexto com os valores e funções disponíveis para os componentes filhos
    return <ToolContext.Provider value={context}>{children}</ToolContext.Provider>
};

// Hook personalizado para facilitar o uso do contexto em outros componentes
export const useTool = () => {
  return useContext(ToolContext);
};