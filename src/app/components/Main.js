/**
 * COMPONENTE PRINCIPAL DE LAYOUT
 * 
 * Este arquivo contém o componente principal que define o layout da aplicação.
 * Ele gerencia a renderização condicional de elementos como navbar, footer e
 * notificações baseado no tipo de página (pública, dashboard ou catálogo).
 * 
 * Funcionalidades:
 * - Layout condicional para diferentes tipos de página
 * - Suporte a modo mobile
 * - Gerenciamento de notificações
 * - Providers de contexto
 * - Navbar e footer condicionais
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente

import { usePathname, useSearchParams } from "next/navigation" // Importa hooks de navegação do Next.js
import Providers from "./Providers" // Importa componente de providers
import NavBar from "./NavBar" // Importa componente de navbar
import CMFooter from "./Footer" // Importa componente de footer
import { NotificationContainer } from "./Notification" // Importa container de notificações
import { useNotification } from "../contexts/NotificationContext" // Importa hook de notificações

export default function Main({children}) {
  // Obtém o caminho atual da página
  const pathname = usePathname();
  // Obtém os parâmetros de busca da URL
  const searchParams = useSearchParams();
  // Verifica se está em modo mobile através dos parâmetros
  const mobileMode = searchParams.get("mobileMode");
  // Obtém notificações e função de remoção do contexto
  const { notifications, removeNotification } = useNotification();
  
  return (
    <>
    {/* Layout para páginas públicas (não catálogo) */}
    {!pathname.includes("/catalog/") ? (
      <div className={`bg-periwinkle w-full h-full min-h-screen text-base font-medium text-prussianblue`}>
        <Providers> {/* Wrapper de providers de contexto */}
          {mobileMode ? (
            /* Layout para modo mobile */
            <>
              <div className="px-6 h-full">{children}</div> {/* Conteúdo com padding */}
            </>
          ) : (
            /* Layout para desktop */
            <>
              <NavBar/> {/* Barra de navegação */}
              <div className="px-6">{children}</div> {/* Conteúdo com padding */}
              <CMFooter/> {/* Rodapé */}
            </>
          )}
        </Providers>
      </div>
    ) : (
      /* Layout para páginas de catálogo (sem navbar/footer) */
      <div className="w-full h-full min-h-screen">
        {children} {/* Apenas o conteúdo */}
      </div>
    )}
    {/* Container de notificações (sempre visível) */}
    <NotificationContainer 
      notifications={notifications} // Array de notificações
      onDismiss={removeNotification} // Função para remover notificações
    />
    </>
  );
}