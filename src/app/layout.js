/**
 * LAYOUT PRINCIPAL DA APLICAÇÃO - ESTRUTURA BASE
 * 
 * Este arquivo define o layout principal de toda a aplicação Catálogo Maker.
 * É o componente raiz que envolve todas as páginas com funcionalidades
 * globais como fontes, estilos, contextos e widgets de acessibilidade.
 * 
 * Funcionalidades:
 * - Define estrutura HTML base da aplicação
 * - Configura fonte personalizada (Inter)
 * - Aplica estilos globais
 * - Fornece contextos globais (notificações)
 * - Inclui widget de acessibilidade
 * - Define metadados padrão para SEO
 */

// Importa fonte Inter do Google Fonts
import { Inter } from "next/font/google";
// Importa estilos globais da aplicação
import "./globals.css";
// Importa componente principal da aplicação
import Main from "./components/Main";
// Importa componente Suspense do React para carregamento assíncrono
import { Suspense } from "react";
// Importa widget de acessibilidade
import AccessibilityWidget from "./components/Accessibility";
// Importa provider de contexto de notificações
import { NotificationProvider } from "./contexts/NotificationContext";

// Configura a fonte Inter com subset latino
const inter = Inter({ subsets: ["latin"] });

// Define metadados padrão da aplicação para SEO
export const metadata = {
    title: {
      default: 'Catálogo Maker: Criar Catálogo de Produtos Online', // Título padrão
      template: '%s - Catálogo Maker' // Template para títulos de páginas filhas
    },
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.", // Descrição padrão
};

// Componente de layout principal da aplicação
export default function RootLayout({ children }) {
  return (
    // Estrutura HTML base com idioma português brasileiro
    <html lang="pt-br">
      {/* Corpo da página com fonte Inter aplicada */}
      <body className={`${inter.className}`}>
        {/* Provider de contexto para notificações globais */}
        <NotificationProvider>
          {/* Widget de acessibilidade para melhorar usabilidade */}
          <AccessibilityWidget/>
          
          {/* Suspense para carregamento assíncrono de componentes */}
          <Suspense>
            {/* Componente principal que envolve todo o conteúdo */}
            <Main>
              {/* Renderiza as páginas filhas (children) */}
              {children}
            </Main>
          </Suspense>
        </NotificationProvider>
      </body>
    </html>
  );
}
