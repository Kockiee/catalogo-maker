'use client'
// Importação de hooks do Next.js para navegação e roteamento
import { useRouter } from "next/navigation";
// Importação do contexto de autenticação
import { useAuth } from "../../contexts/AuthContext";
// Importação de hooks do Next.js para obter o caminho atual
import { usePathname } from "next/navigation";
// Importação de hooks do React para efeitos e estado
import { useEffect, useState } from "react";
// Importação do componente Spinner do Flowbite React
import { Spinner } from "flowbite-react";
// Importação do provedor de contexto de ferramentas
import { ToolProvider } from "../../contexts/ToolContext";
// Importação do componente container de ferramentas
import ToolContainer from "./ToolContainer";

/**
 * Layout principal do dashboard da aplicação
 * Gerencia autenticação, permissões premium, redirecionamentos e estrutura base
 * @param {React.ReactNode} children - Componentes filhos a serem renderizados
 * @returns {JSX.Element} Layout do dashboard ou tela de carregamento/redirecionamento
 */
export default function DashboardLayout({ children }) {
    // Desestruturação dos dados de autenticação do contexto
    const { DBUser, user, mobileMode } = useAuth();
    // Hook para obter o caminho atual da URL
    const pathname = usePathname();
    // Hook para navegação programática
    const router = useRouter();

  // Estado para controlar se o usuário é premium (inicial null para evitar re-renderizações)
  const [isPremiumUser, setIsPremiumUser] = useState(null);

  /**
   * Efeito para definir se o usuário é premium com base nos dados do DBUser
   * Só executa quando DBUser é carregado para evitar valores incorretos
   */
  useEffect(() => {
    if (DBUser) {
      setIsPremiumUser(DBUser.premium);  // Atualiza o estado com o status premium do usuário
    }
  }, [DBUser]);

  /**
   * Efeito para redirecionamento baseado no status de autenticação e verificação de email
   * Garante que usuários não autenticados ou com email não verificado sejam redirecionados
   */
  useEffect(() => {
    if (user === null) {
      // Redireciona para login se usuário não estiver autenticado
      router.push(`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`);
    } else if (user && !user.emailVerified) {
      // Redireciona para verificação de email se usuário não verificou o email
      router.push(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [user, mobileMode, router]);

  /**
   * Efeito para redirecionamento baseado no status premium do usuário
   * Usuários não premium só podem acessar páginas de plano e conta
   */
  useEffect(() => {
    if (isPremiumUser === false && pathname !== "/dashboard/plan" && pathname !== "/dashboard/account") {
      // Redireciona para página de planos se usuário não for premium e tentar acessar outras páginas
      router.push(`/dashboard/plan${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [pathname, isPremiumUser, mobileMode, router]);

  /**
   * Renderização condicional baseada no status de carregamento dos dados do usuário
   * Exibe spinner enquanto dados estão sendo carregados, ou redireciona se necessário
   */
  if (user === false || user === null || DBUser === false || DBUser === null) {
    // Mostra tela de carregamento enquanto dados do usuário não foram carregados
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
        <Spinner className="text-lightcyan" size="xl" />
        <span>Carregando...</span>
      </div>
    );
  } else {
    // Renderiza o layout do dashboard com provedores de contexto
    return (
      <ToolProvider user={user}>        {/* Fornece contexto de ferramentas */}
        <ToolContainer>{children}</ToolContainer>  {/* Container com sidebar e conteúdo */}
      </ToolProvider>
    );
  }
}