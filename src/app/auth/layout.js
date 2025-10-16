/**
 * Layout para páginas de autenticação
 * 
 * Este arquivo define o layout comum para todas as páginas de autenticação
 * (login, cadastro, verificação de email, etc.). Gerencia redirecionamentos
 * automáticos baseados no status de autenticação do usuário e inclui
 * componentes comuns como botão de voltar.
 */

'use client'
// Importa o hook useEffect para gerenciar efeitos colaterais
import { useEffect } from 'react';
// Importa hooks de navegação do Next.js
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// Importa o contexto de autenticação
import { useAuth } from '../contexts/AuthContext';
// Importa o componente de botão de voltar
import BackButton from '../dashboard/components/BackButton';

/**
 * Componente de layout para páginas de autenticação
 * @param {object} children - Componentes filhos a serem renderizados
 * @returns {JSX.Element} - Layout com botão de voltar e conteúdo
 */
export default function RootLayout({ children }) {
  // Obtém dados do usuário e usuário do banco de dados do contexto de autenticação
  const { user, DBUser } = useAuth();
  // Obtém o caminho atual da URL
  const pathname = usePathname();
  // Obtém os parâmetros de busca da URL
  const searchParams = useSearchParams();
  // Obtém a função de navegação do roteador
  const router = useRouter();
  // Verifica se está no modo mobile através dos parâmetros da URL
  const mobileMode = searchParams.get("mobileMode");

  // Efeito que gerencia redirecionamentos automáticos baseados no status de autenticação
  useEffect(() => {
    // Verifica se o usuário está autenticado e tem dados no banco
    if (user && DBUser) {
      // Se o email não foi verificado e não está nas páginas de verificação, redireciona para verificação
      if (!user.emailVerified && pathname !== "/auth/verify-email" && pathname !== "/auth/action") {
        router.push(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
      }
    }
  }, [user, DBUser, pathname, mobileMode, router]);
  
  return (
    <>
      {/* Container com largura máxima e botão de voltar */}
      <div className="max-w-4xl w-full">
        <BackButton />
      </div>
      {/* Renderiza o conteúdo das páginas filhas */}
      {children}
    </>
  );
}