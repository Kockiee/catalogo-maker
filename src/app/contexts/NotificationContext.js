/**
 * CONTEXTO DE NOTIFICAÇÕES
 * 
 * Este arquivo contém o contexto de notificações que gerencia a exibição de
 * notificações para o usuário. Permite adicionar, remover e controlar
 * notificações de diferentes tipos (sucesso, erro, aviso, informação).
 * 
 * Funcionalidades:
 * - Adicionar notificações de diferentes tipos
 * - Remover notificações individuais
 * - Limpar todas as notificações
 * - Auto-remoção após duração configurável
 * - Métodos de conveniência para cada tipo
 * - Geração automática de IDs únicos
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { createContext, useContext, useState, useCallback } from 'react'; // Importa hooks do React

// Cria o contexto de notificações
const NotificationContext = createContext();

// Hook personalizado para usar o contexto de notificações
export const useNotification = () => {
  const context = useContext(NotificationContext); // Obtém o contexto
  if (!context) { // Se contexto não existe
    throw new Error('useNotification must be used within a NotificationProvider'); // Lança erro
  }
  return context; // Retorna o contexto
};

export const NotificationProvider = ({ children }) => {
  // Estado para armazenar array de notificações
  const [notifications, setNotifications] = useState([]);

  // Função para adicionar uma notificação
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random(); // Gera ID único baseado em timestamp e número aleatório
    const newNotification = {
      id, // ID único
      type: notification.type || 'info', // Tipo da notificação (padrão: info)
      message: notification.message, // Mensagem da notificação
      duration: notification.duration || 5000, // Duração em ms (padrão: 5 segundos)
      ...notification // Outras propriedades customizadas
    };

    setNotifications(prev => [...prev, newNotification]); // Adiciona notificação ao array

    // Auto remove notification after duration
    if (newNotification.duration > 0) { // Se duração é maior que 0
      setTimeout(() => {
        removeNotification(id); // Remove notificação após a duração
      }, newNotification.duration);
    }

    return id; // Retorna ID da notificação criada
  }, []);

  // Função para remover uma notificação específica
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id)); // Filtra notificação pelo ID
  }, []);

  // Função para limpar todas as notificações
  const clearAllNotifications = useCallback(() => {
    setNotifications([]); // Define array vazio
  }, []);

  // Convenience methods - Métodos de conveniência para cada tipo

  // Método para adicionar notificação de sucesso
  const success = useCallback((message, options = {}) => {
    return addNotification({ type: 'success', message, ...options }); // Adiciona com tipo success
  }, [addNotification]);

  // Método para adicionar notificação de erro
  const error = useCallback((message, options = {}) => {
    return addNotification({ type: 'error', message, ...options }); // Adiciona com tipo error
  }, [addNotification]);

  // Método para adicionar notificação de aviso
  const warning = useCallback((message, options = {}) => {
    return addNotification({ type: 'warning', message, ...options }); // Adiciona com tipo warning
  }, [addNotification]);

  // Método para adicionar notificação de informação
  const info = useCallback((message, options = {}) => {
    return addNotification({ type: 'info', message, ...options }); // Adiciona com tipo info
  }, [addNotification]);

  // Objeto com todos os valores e funções do contexto
  const value = {
    notifications, // Array de notificações ativas
    addNotification, // Função genérica para adicionar notificação
    removeNotification, // Função para remover notificação
    clearAllNotifications, // Função para limpar todas
    success, // Método de conveniência para sucesso
    error, // Método de conveniência para erro
    warning, // Método de conveniência para aviso
    info // Método de conveniência para informação
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
