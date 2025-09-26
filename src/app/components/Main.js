'use client'  // Diretiva para indicar que este é um componente do lado do cliente

// Importação de hooks do Next.js para acessar o caminho atual e parâmetros de busca
import { usePathname, useSearchParams } from "next/navigation"
// Importação do componente Providers que fornece contextos para a aplicação
import Providers from "./Providers"
// Importação do componente de barra de navegação
import NavBar from "./NavBar"
// Importação do componente de rodapé
import CMFooter from "./Footer"
// Importação do componente de container de notificações
import { NotificationContainer } from "./Notification"
// Importação do hook personalizado para gerenciar notificações
import { useNotification } from "../contexts/NotificationContext"

/**
 * Componente principal que envolve toda a aplicação
 * Responsável por renderizar o layout base incluindo navegação, conteúdo e notificações
 * @param {React.ReactNode} children - Componentes filhos a serem renderizados
 * @returns {JSX.Element} Layout principal da aplicação
 */
export default function Main({children}) {
  // Hook para obter o caminho atual da URL (ex: /dashboard, /catalog/123)
  const pathname = usePathname();
  // Hook para obter os parâmetros de busca da URL (ex: ?mobileMode=True)
  const searchParams = useSearchParams();
  // Verifica se o modo móvel está ativado através dos parâmetros de busca
  // Converte o valor string para booleano: "True" -> true, outros -> false
  const mobileMode = searchParams.get("mobileMode");
  // Desestrutura as notificações e a função para removê-las do contexto de notificações
  const { notifications, removeNotification } = useNotification();
  
  // Renderiza o layout principal da aplicação
  return (
    <>
    {/* Renderização condicional baseada no caminho da URL */}
    {/* Se o caminho não incluir "/catalog/", usa layout padrão */}
    {!pathname.includes("/catalog/") ? (
      // Layout padrão para páginas que não são de catálogo
      <div className={`bg-periwinkle w-full h-full min-h-screen text-base font-medium text-prussianblue`}>
        {/* Componente Providers que fornece contextos para toda a aplicação */}
        <Providers>
          {/* Renderização condicional baseada no modo móvel */}
          {mobileMode ? (
            // Layout para dispositivos móveis (sem navbar e footer)
            // Apenas renderiza o conteúdo com padding lateral
            <>
              <div className="px-6 h-full">{children}</div>
            </>
          ) : (
            // Layout para desktop (com navbar e footer)
            // Renderiza navegação, conteúdo principal e rodapé
            <>
              <NavBar/>                    {/* Barra de navegação no topo */}
              <div className="px-6">{children}</div> {/* Conteúdo principal */}
              <CMFooter/>                  {/* Rodapé da aplicação */}
            </>
          )}
        </Providers>
      </div>
    ) : (
      // Layout específico para páginas de catálogo
      // Renderiza apenas o conteúdo sem estilos adicionais de fundo
      <div className="w-full h-full min-h-screen">
        {children} {/* Conteúdo do catálogo */}
      </div>
    )}
    {/* Container de notificações que é renderizado em todas as páginas */}
    {/* Posicionado globalmente e sempre visível */}
    {/* Array com todas as notificações ativas */}
    {/* Função para remover notificações */}
    <NotificationContainer
      notifications={notifications}
      onDismiss={removeNotification}
    />
    </>
  );
}