/**
 * COMPONENTE DE NOTIFICAÇÕES
 * 
 * Este arquivo contém componentes para exibir notificações na aplicação.
 * Inclui notificações individuais, container de notificações e componente
 * legado para compatibilidade. As notificações suportam diferentes tipos
 * (sucesso, erro, aviso, informação) com ícones e cores apropriadas.
 * 
 * Funcionalidades:
 * - Notificações com diferentes tipos e estilos
 * - Ícones específicos para cada tipo
 * - Container para múltiplas notificações
 * - Posicionamento fixo na tela
 * - Função de dismiss individual
 * - Suporte a tema escuro
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Toast } from "flowbite-react"; // Importa componente Toast do Flowbite
import { HiCheck, HiExclamation, HiX, HiInformationCircle } from "react-icons/hi"; // Importa ícones para diferentes tipos de notificação

// Componente individual de notificação
export const NotificationItem = ({ notification, onDismiss }) => {
  // Função para obter o ícone baseado no tipo da notificação
  const getIcon = () => {
    switch (notification.type) {
      case 'success': // Notificação de sucesso
        return <HiCheck className="h-5 w-5" />;
      case 'error': // Notificação de erro
        return <HiX className="h-5 w-5" />;
      case 'warning': // Notificação de aviso
        return <HiExclamation className="h-5 w-5" />;
      case 'info': // Notificação de informação
      default: // Tipo padrão
        return <HiInformationCircle className="h-5 w-5" />;
    }
  };

  // Função para obter estilos do ícone baseado no tipo
  const getIconStyles = () => {
    switch (notification.type) {
      case 'success': // Verde para sucesso
        return "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200";
      case 'error': // Vermelho para erro
        return "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200";
      case 'warning': // Laranja para aviso
        return "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200";
      case 'info': // Azul para informação
      default: // Azul como padrão
        return "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200";
    }
  };

  return (
    <Toast className="mb-2">
      {/* Ícone da notificação com estilo baseado no tipo */}
      <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getIconStyles()}`}>
        {getIcon()}
      </div>
      {/* Mensagem da notificação */}
      <div className="ml-3 text-sm font-normal">{notification.message}</div>
      {/* Botão de fechar */}
      <Toast.Toggle onDismiss={() => onDismiss(notification.id)} />
    </Toast>
  );
};

// Container de notificações
export const NotificationContainer = ({ notifications, onDismiss }) => {
  // Se não há notificações, não renderiza nada
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
      <div className="max-w-md w-full mx-4">
        {/* Mapeia e renderiza cada notificação */}
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id} // Chave única para cada notificação
            notification={notification} // Dados da notificação
            onDismiss={onDismiss} // Função para remover notificação
          />
        ))}
      </div>
    </div>
  );
};

// Componente legado para compatibilidade (será removido gradualmente)
export default function Notification({ type, message, setPattern }) {
  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center z-20">
      <NotificationItem
        notification={{ id: Date.now(), type, message }} // Cria notificação com ID único
        onDismiss={() => setPattern(<></>)} // Função de dismiss que limpa o padrão
      />
    </div>
  );
}