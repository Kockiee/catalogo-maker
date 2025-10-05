/**
 * Layout principal da área do dashboard
 * 
 * Este arquivo define o layout base para todas as páginas do dashboard.
 * Ele envolve todas as páginas filhas com o componente DashboardLayout,
 * que fornece a estrutura comum (sidebar, navbar, etc.) para todas
 * as páginas do painel administrativo.
 * 
 * Funcionalidades:
 * - Define metadados da página (título e descrição)
 * - Aplica o layout comum a todas as páginas do dashboard
 * - Gerencia a estrutura de navegação e sidebar
 */

// Importa o componente Suspense do React para lazy loading
import { Suspense } from "react";
// Importa o componente de layout do dashboard
import DashboardLayout from "./components/DashboardLayout";

// Define os metadados da página para SEO
export const metadata = {
  title: 'Dashboard', // Título da página
  description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.", // Descrição da página
};

// Componente principal que renderiza o layout do dashboard
export default function PAGE({children}) {
    return (
      // Envolve todas as páginas filhas com o layout comum do dashboard
      <DashboardLayout>
        {children}
      </DashboardLayout>
    )
}