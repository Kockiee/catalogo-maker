// Importação do componente Suspense do React (não utilizado neste arquivo)
import { Suspense } from "react";
// Importação do componente de layout do dashboard
import DashboardLayout from "./components/DashboardLayout";

/**
 * Metadados da página do dashboard
 * Utilizados para SEO e informações da página no navegador
 */
export const metadata = {
  title: 'Dashboard',  // Título exibido na aba do navegador
  description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.", // Descrição para SEO
};

/**
 * Layout da seção de dashboard da aplicação
 * Fornece a estrutura base com navegação lateral e cabeçalho para todas as páginas do dashboard
 * @param {React.ReactNode} children - Componentes filhos (conteúdo específico de cada página)
 * @returns {JSX.Element} Layout estruturado do dashboard
 */
export default function PAGE({children}) {
    // Renderiza o layout do dashboard envolvendo o conteúdo específico de cada página
    return (
      <DashboardLayout>
        {children}  {/* Conteúdo específico da página atual */}
      </DashboardLayout>
    )
}