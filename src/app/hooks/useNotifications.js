/**
 * Hook personalizado para gerenciar notificações no sistema
 * 
 * Este arquivo contém um hook personalizado que facilita o uso do sistema de notificações
 * em toda a aplicação. Ele fornece métodos pré-definidos para diferentes tipos de notificações
 * (sucesso, erro, aviso, informação) e permite notificações customizadas.
 * 
 * Funcionalidades principais:
 * - Métodos de conveniência para notificações comuns (criação, atualização, exclusão)
 * - Suporte a diferentes tipos de notificação (success, error, warning, info)
 * - Gerenciamento de notificações (adicionar, remover, limpar todas)
 * - Mensagens pré-definidas para ações específicas do sistema
 */

'use client'
// Importa o contexto de notificações para acessar as funções de gerenciamento
import { useNotification } from '../contexts/NotificationContext';

// Hook personalizado para facilitar o uso das notificações
export const useNotifications = () => {
  // Extrai todas as funções necessárias do contexto de notificações
  const { success, error, warning, info, addNotification, removeNotification, clearAllNotifications } = useNotification();

  // Objeto que contém métodos de conveniência com mensagens pré-definidas para diferentes situações
  const notify = {
    // Seção de notificações de sucesso - exibidas quando operações são concluídas com êxito
    productCreated: () => success('Produto criado com sucesso!'), // Notifica quando um produto é criado
    productUpdated: () => success('Produto atualizado com sucesso!'), // Notifica quando um produto é atualizado
    productDeleted: () => success('Produto(s) excluído(s) com sucesso!'), // Notifica quando produto(s) são excluídos
    catalogCreated: () => success('Catálogo criado com sucesso!'), // Notifica quando um catálogo é criado
    catalogUpdated: () => success('Catálogo atualizado com sucesso!'), // Notifica quando um catálogo é atualizado
    catalogDeleted: () => success('Catálogo(s) excluído(s) com sucesso!'), // Notifica quando catálogo(s) são excluídos
    orderCreated: () => success('Pedido enviado com sucesso!'), // Notifica quando um pedido é enviado
    orderAccepted: () => success('Pedido aceito com sucesso!'), // Notifica quando um pedido é aceito
    orderRefused: () => success('Pedido recusado com sucesso!'), // Notifica quando um pedido é recusado
    accountDeleted: () => success('Conta excluída com sucesso!'), // Notifica quando uma conta é excluída
    dataSaved: () => success('Dados salvos com sucesso!'), // Notifica quando dados são salvos
    copiedToClipboard: () => success('Copiado para a área de transferência!'), // Notifica quando algo é copiado

    // Seção de notificações de erro - exibidas quando operações falham
    productCreationFailed: () => error('Erro ao criar produto. Tente novamente.'), // Erro ao criar produto
    productUpdateFailed: () => error('Erro ao atualizar produto. Tente novamente.'), // Erro ao atualizar produto
    productDeletionFailed: () => error('Erro ao excluir produto(s). Tente novamente.'), // Erro ao excluir produto(s)
    catalogCreationFailed: () => error('Erro ao criar catálogo. Tente novamente.'), // Erro ao criar catálogo
    catalogUpdateFailed: () => error('Erro ao atualizar catálogo. Tente novamente.'), // Erro ao atualizar catálogo
    catalogDeletionFailed: () => error('Erro ao excluir catálogo(s). Tente novamente.'), // Erro ao excluir catálogo(s)
    orderCreationFailed: () => error('Erro ao enviar pedido. Tente novamente.'), // Erro ao enviar pedido
    orderUpdateFailed: () => error('Erro ao atualizar pedido. Tente novamente.'), // Erro ao atualizar pedido
    accountDeletionFailed: () => error('Erro ao excluir conta. Tente novamente.'), // Erro ao excluir conta
    saveFailed: () => error('Erro ao salvar dados. Tente novamente.'), // Erro ao salvar dados
    networkError: () => error('Erro de conexão. Verifique sua internet.'), // Erro de conexão com a internet
    invalidData: () => error('Dados inválidos. Verifique as informações.'), // Dados fornecidos são inválidos
    unauthorized: () => error('Acesso negado. Faça login novamente.'), // Usuário não tem permissão

    // Seção de notificações de aviso - exibidas para alertar o usuário sobre situações importantes
    loading: (message = 'Carregando...') => warning(message), // Mostra que algo está carregando
    processing: (message = 'Processando...') => warning(message), // Mostra que algo está sendo processado
    noProductsSelected: () => warning('Selecione pelo menos um produto.'), // Avisa que nenhum produto foi selecionado
    noCatalogsSelected: () => warning('Selecione pelo menos um catálogo.'), // Avisa que nenhum catálogo foi selecionado
    imageRequired: () => warning('É necessário selecionar uma imagem.'), // Avisa que uma imagem é obrigatória
    phoneRequired: () => warning('É necessário informar um número de telefone válido.'), // Avisa que telefone é obrigatório
    nameRequired: () => warning('É necessário informar um nome.'), // Avisa que nome é obrigatório
    priceRequired: () => warning('É necessário informar um preço válido.'), // Avisa que preço é obrigatório

    // Seção de notificações informativas - exibidas para fornecer informações ao usuário
    selectItems: () => info('Selecione os itens que deseja gerenciar.'), // Informa que é necessário selecionar itens
    changesNotSaved: () => info('Você tem alterações não salvas.'), // Informa sobre alterações não salvas
    comingSoon: () => info('Funcionalidade em breve!'), // Informa que uma funcionalidade estará disponível em breve
    maintenance: () => info('Sistema em manutenção. Tente novamente mais tarde.'), // Informa sobre manutenção do sistema

    // Métodos genéricos que permitem criar notificações customizadas
    success: (message, options = {}) => success(message, options), // Cria notificação de sucesso customizada
    error: (message, options = {}) => error(message, options), // Cria notificação de erro customizada
    warning: (message, options = {}) => warning(message, options), // Cria notificação de aviso customizada
    info: (message, options = {}) => info(message, options), // Cria notificação informativa customizada
    custom: (type, message, options = {}) => addNotification({ type, message, ...options }) // Cria notificação completamente customizada
  };

  // Retorna um objeto com todas as funcionalidades do hook de notificações
  return {
    notify, // Objeto com métodos de conveniência para notificações pré-definidas
    removeNotification, // Função para remover uma notificação específica
    clearAllNotifications, // Função para limpar todas as notificações
    // Métodos diretos para casos específicos - acesso direto às funções do contexto
    success, // Função direta para criar notificações de sucesso
    error, // Função direta para criar notificações de erro
    warning, // Função direta para criar notificações de aviso
    info, // Função direta para criar notificações informativas
    addNotification // Função direta para adicionar notificações customizadas
  };
};
