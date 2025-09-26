'use client' // Diretiva para indicar que este código executa no cliente

// Importação de hooks do React necessários para o contexto de notificações
import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Contexto para gerenciamento global de notificações na aplicação
 * Fornece funcionalidades para exibir, gerenciar e remover notificações de diferentes tipos
 * Suporta notificações automáticas com temporizadores e diferentes estilos visuais
 */
const NotificationContext = createContext();

/**
 * Hook personalizado para facilitar o uso do contexto de notificações em outros componentes
 * Lança erro se usado fora do NotificationProvider
 * @returns {Object} Objeto contendo todas as funções e estados de notificação
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

/**
 * Provedor do contexto que disponibiliza as funcionalidades de notificação para a aplicação
 * Gerencia o estado global das notificações e fornece métodos para manipulá-las
 * @param {React.ReactNode} children - Componentes filhos que terão acesso ao contexto
 * @returns {JSX.Element} Provedor do contexto com funcionalidades de notificação
 */
export const NotificationProvider = ({ children }) => {
  // Estado para armazenar todas as notificações ativas na aplicação
  // Cada notificação é um objeto com id, type, message, duration e outras propriedades
  const [notifications, setNotifications] = useState([]);

  /**
   * Função para adicionar uma nova notificação ao sistema
   * Gera ID único, define valores padrão e configura auto-remoção
   * @param {Object} notification - Objeto com dados da notificação
   * @param {string} notification.type - Tipo da notificação (success, error, warning, info)
   * @param {string} notification.message - Mensagem a ser exibida
   * @param {number} notification.duration - Tempo em ms antes da auto-remoção (0 = permanente)
   * @returns {number} ID único da notificação criada
   */
  const addNotification = useCallback((notification) => {
    // Gera um ID único combinando timestamp e número aleatório
    const id = Date.now() + Math.random();
    // Cria o objeto de notificação com valores padrão quando não especificados
    const newNotification = {
      id,                               // ID único para identificação
      type: notification.type || 'info', // Tipo padrão: info
      message: notification.message,     // Mensagem obrigatória
      duration: notification.duration || 5000, // Duração padrão: 5 segundos
      ...notification                   // Outras propriedades opcionais
    };

    // Adiciona a nova notificação ao estado (funcional update para evitar race conditions)
    setNotifications(prev => [...prev, newNotification]);

    // Configura auto-remoção se duration for maior que 0
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id); // Remove a notificação após o tempo especificado
      }, newNotification.duration);
    }

    return id; // Retorna o ID para possível controle manual
  }, []);

  /**
   * Função para remover uma notificação específica pelo seu ID
   * @param {number} id - ID único da notificação a ser removida
   */
  const removeNotification = useCallback((id) => {
    // Filtra o array removendo a notificação com o ID especificado
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * Função para limpar todas as notificações de uma vez
   * Remove todas as notificações ativas do estado
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]); // Zera o array de notificações
  }, []);

  /**
   * Métodos de conveniência para diferentes tipos de notificações
   * Fornecem uma interface mais simples para criar notificações comuns
   */

  /**
   * Função para criar notificação de sucesso (verde)
   * @param {string} message - Mensagem de sucesso a ser exibida
   * @param {Object} options - Opções adicionais para a notificação
   * @returns {number} ID da notificação criada
   */
  const success = useCallback((message, options = {}) => {
    return addNotification({ type: 'success', message, ...options });
  }, [addNotification]);

  /**
   * Função para criar notificação de erro (vermelho)
   * @param {string} message - Mensagem de erro a ser exibida
   * @param {Object} options - Opções adicionais para a notificação
   * @returns {number} ID da notificação criada
   */
  const error = useCallback((message, options = {}) => {
    return addNotification({ type: 'error', message, ...options });
  }, [addNotification]);

  /**
   * Função para criar notificação de aviso (amarelo)
   * @param {string} message - Mensagem de aviso a ser exibida
   * @param {Object} options - Opções adicionais para a notificação
   * @returns {number} ID da notificação criada
   */
  const warning = useCallback((message, options = {}) => {
    return addNotification({ type: 'warning', message, ...options });
  }, [addNotification]);

  /**
   * Função para criar notificação informativa (azul)
   * @param {string} message - Mensagem informativa a ser exibida
   * @param {Object} options - Opções adicionais para a notificação
   * @returns {number} ID da notificação criada
   */
  const info = useCallback((message, options = {}) => {
    return addNotification({ type: 'info', message, ...options });
  }, [addNotification]);

  /**
   * Objeto com todos os valores e funções que serão disponibilizados pelo contexto
   * Este objeto é passado como value para o Provider e fica disponível em toda a árvore de componentes
   */
  const value = {
    notifications,          // Array com todas as notificações ativas
    addNotification,        // Função para adicionar notificações
    removeNotification,     // Função para remover notificações específicas
    clearAllNotifications,  // Função para limpar todas as notificações
    success,                // Método de conveniência para notificações de sucesso
    error,                  // Método de conveniência para notificações de erro
    warning,                // Método de conveniência para notificações de aviso
    info                    // Método de conveniência para notificações informativas
  };

  /**
   * Retorna o provedor do contexto com os valores e funções disponíveis para os componentes filhos
   * Todos os componentes dentro deste provider terão acesso às funcionalidades de notificação
   */
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
