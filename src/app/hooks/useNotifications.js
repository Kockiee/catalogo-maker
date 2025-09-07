'use client'
import { useNotification } from '../contexts/NotificationContext';

// Hook personalizado para facilitar o uso das notificações
export const useNotifications = () => {
  const { success, error, warning, info, addNotification, removeNotification, clearAllNotifications } = useNotification();

  // Métodos de conveniência com mensagens pré-definidas
  const notify = {
    // Sucesso
    productCreated: () => success('Produto criado com sucesso!'),
    productUpdated: () => success('Produto atualizado com sucesso!'),
    productDeleted: () => success('Produto(s) excluído(s) com sucesso!'),
    catalogCreated: () => success('Catálogo criado com sucesso!'),
    catalogUpdated: () => success('Catálogo atualizado com sucesso!'),
    catalogDeleted: () => success('Catálogo(s) excluído(s) com sucesso!'),
    orderCreated: () => success('Pedido enviado com sucesso!'),
    orderAccepted: () => success('Pedido aceito com sucesso!'),
    orderRefused: () => success('Pedido recusado com sucesso!'),
    accountDeleted: () => success('Conta excluída com sucesso!'),
    dataSaved: () => success('Dados salvos com sucesso!'),
    copiedToClipboard: () => success('Copiado para a área de transferência!'),

    // Erro
    productCreationFailed: () => error('Erro ao criar produto. Tente novamente.'),
    productUpdateFailed: () => error('Erro ao atualizar produto. Tente novamente.'),
    productDeletionFailed: () => error('Erro ao excluir produto(s). Tente novamente.'),
    catalogCreationFailed: () => error('Erro ao criar catálogo. Tente novamente.'),
    catalogUpdateFailed: () => error('Erro ao atualizar catálogo. Tente novamente.'),
    catalogDeletionFailed: () => error('Erro ao excluir catálogo(s). Tente novamente.'),
    orderCreationFailed: () => error('Erro ao enviar pedido. Tente novamente.'),
    orderUpdateFailed: () => error('Erro ao atualizar pedido. Tente novamente.'),
    accountDeletionFailed: () => error('Erro ao excluir conta. Tente novamente.'),
    saveFailed: () => error('Erro ao salvar dados. Tente novamente.'),
    networkError: () => error('Erro de conexão. Verifique sua internet.'),
    invalidData: () => error('Dados inválidos. Verifique as informações.'),
    unauthorized: () => error('Acesso negado. Faça login novamente.'),

    // Aviso
    loading: (message = 'Carregando...') => warning(message),
    processing: (message = 'Processando...') => warning(message),
    noProductsSelected: () => warning('Selecione pelo menos um produto.'),
    noCatalogsSelected: () => warning('Selecione pelo menos um catálogo.'),
    imageRequired: () => warning('É necessário selecionar uma imagem.'),
    phoneRequired: () => warning('É necessário informar um número de telefone válido.'),
    nameRequired: () => warning('É necessário informar um nome.'),
    priceRequired: () => warning('É necessário informar um preço válido.'),

    // Info
    selectItems: () => info('Selecione os itens que deseja gerenciar.'),
    changesNotSaved: () => info('Você tem alterações não salvas.'),
    comingSoon: () => info('Funcionalidade em breve!'),
    maintenance: () => info('Sistema em manutenção. Tente novamente mais tarde.'),

    // Métodos genéricos
    success: (message, options = {}) => success(message, options),
    error: (message, options = {}) => error(message, options),
    warning: (message, options = {}) => warning(message, options),
    info: (message, options = {}) => info(message, options),
    custom: (type, message, options = {}) => addNotification({ type, message, ...options })
  };

  return {
    notify,
    removeNotification,
    clearAllNotifications,
    // Métodos diretos para casos específicos
    success,
    error,
    warning,
    info,
    addNotification
  };
};
