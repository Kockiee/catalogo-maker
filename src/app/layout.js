// Importação da fonte Inter do Google Fonts para uso em toda a aplicação
import { Inter } from "next/font/google";
// Importação dos estilos globais da aplicação
import "./globals.css";
// Importação do componente Main que serve como container principal da aplicação
import Main from "./components/Main";
// Importação do componente Suspense do React para lidar com carregamento assíncrono
import { Suspense } from "react";
// Importação do widget de acessibilidade para melhorar a experiência de usuários com necessidades especiais
import AccessibilityWidget from "./components/Accessibility";
// Importação do provedor de notificações que gerencia todas as notificações do sistema
import { NotificationProvider } from "./contexts/NotificationContext";

// Configuração da fonte Inter com o subconjunto latino para otimização de carregamento
const inter = Inter({ subsets: ["latin"] });

// Definição dos metadados da aplicação para SEO e exibição no navegador
export const metadata = {
    title: {
      // Título padrão da página quando nenhum título específico é fornecido
      default: 'Catálogo Maker: Criar Catálogo de Produtos Online',
      // Template para títulos de páginas específicas, onde %s será substituído pelo título da página
      template: '%s - Catálogo Maker'
    },
    // Descrição da aplicação para SEO e compartilhamento em redes sociais
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

// Componente de layout raiz que envolve toda a aplicação
export default function RootLayout({ children }) {
  return (
    // Definição do elemento HTML com idioma português do Brasil
    <html lang="pt-br">
      {/* Corpo da página com a classe da fonte Inter aplicada */}
      <body className={`${inter.className}`}>
        {/* Provedor de notificações que permite o uso de notificações em toda a aplicação */}
        <NotificationProvider>
          {/* Widget de acessibilidade para melhorar a experiência de usuários com necessidades especiais */}
          <AccessibilityWidget/>
          {/* Suspense para lidar com carregamento assíncrono de componentes */}
          <Suspense>
            {/* Componente Main que serve como container principal da aplicação */}
            <Main>
              {/* Renderização dos componentes filhos específicos de cada página */}
              {children}
            </Main>
          </Suspense>
        </NotificationProvider>
      </body>
    </html>
  );
}
