/**
 * Layout principal do dashboard com autenticação e controle de acesso
 * 
 * Este arquivo contém o layout principal do dashboard que gerencia
 * autenticação, verificação de email, controle de acesso premium
 * e redirecionamentos automáticos. Ele envolve todas as páginas
 * do dashboard com os contextos necessários e validações de segurança.
 * 
 * Funcionalidades principais:
 * - Verificação de autenticação do usuário
 * - Verificação de email verificado
 * - Controle de acesso premium
 * - Redirecionamentos automáticos baseados no status do usuário
 * - Loading states durante carregamento de dados
 */

'use client'
// Importa hook de navegação do Next.js
import { useRouter } from "next/navigation";
// Importa contexto de autenticação
import { useAuth } from "../../contexts/AuthContext";
// Importa hook para obter o caminho atual da URL
import { usePathname } from "next/navigation";
// Importa hooks do React para efeitos e estado
import { useEffect, useState } from "react";
// Importa provider do contexto de ferramentas
import { ToolProvider } from "../../contexts/ToolContext";
// Importa container de ferramentas
import ToolContainer from "./ToolContainer";
// Importa componente de loading em tela cheia
import { FullScreenLoader } from "../../components/FullScreenLoader";

// Componente principal do layout do dashboard
export default function DashboardLayout({ children }) {
  // Extrai dados do usuário, dados do banco e modo mobile do contexto de autenticação
  const { DBUser, user, mobileMode } = useAuth();
  // Obtém o caminho atual da URL
  const pathname = usePathname();
  // Hook para navegação programática
  const router = useRouter();

  // Estado inicial definido como false para evitar re-renderizações inesperadas
  const [isPremiumUser, setIsPremiumUser] = useState(null);

  // Define se o usuário é premium com base no DBUser
  useEffect(() => {
    if (DBUser) {
      setIsPremiumUser(DBUser.premium); // Atualiza status premium baseado nos dados do banco
    }
  }, [DBUser]); // Executa quando DBUser muda

  // Redirecionamento baseado no status de login e verificação de email
  useEffect(() => {
    if (user === null) {
      // Se não há usuário logado, redireciona para login
      router.push(`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`);
    } else if (user && !user.emailVerified) {
      // Se usuário logado mas email não verificado, redireciona para verificação
      router.push(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [user, mobileMode, router]); // Executa quando user, mobileMode ou router mudam

  // Redirecionamento se o usuário não for premium
  useEffect(() => {
    // Se não é premium e não está nas páginas permitidas, redireciona para planos
    if (isPremiumUser === false && pathname !== "/dashboard/plan" && pathname !== "/dashboard/account") {
      router.push(`/dashboard/plan${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [pathname, isPremiumUser, mobileMode, router]); // Executa quando pathname, isPremiumUser, mobileMode ou router mudam

  // Exibir um spinner de carregamento enquanto os dados do usuário ainda não foram carregados
  if (user === false || user === null || DBUser === false || DBUser === null) {
    return <FullScreenLoader message="Carregando..." />; // Mostra loading enquanto carrega dados
  } else {
    return (
      // Envolve as páginas filhas com os contextos necessários
      <ToolProvider user={user}>
        <ToolContainer>{children}</ToolContainer>
      </ToolProvider>
    );
  }
}