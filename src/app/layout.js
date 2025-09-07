import { Inter } from "next/font/google";
import "./globals.css";
import Main from "./components/Main";
import { Suspense } from "react";
import AccessibilityWidget from "./components/Accessibility";
import { NotificationProvider } from "./contexts/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: {
      default: 'Catálogo Maker: Criar Catálogo de Produtos Online',
      template: '%s - Catálogo Maker'
    },
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className}`}>
        <NotificationProvider>
          <AccessibilityWidget/>
          <Suspense>
            <Main>
              {children}
            </Main>
          </Suspense>
        </NotificationProvider>
      </body>
    </html>
  );
}
