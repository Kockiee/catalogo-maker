
/**
 * Layout das páginas de autenticação
 * Redireciona para dashboard se o email estiver verificado
 * Redireciona para verificação de email se necessário
 * Exibe botão de voltar e os componentes filhos
 * @returns {JSX.Element} Layout de autenticação
 */
// Indica que este componente é um Client Component do Next.js
'use client'

// Importa o hook useEffect para efeitos colaterais
import { useEffect } from 'react';
// Importa hooks de navegação do Next.js para manipular rotas e parâmetros
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// Importa o contexto de autenticação para acessar dados do usuário
import { useAuth } from '../contexts/AuthContext';
// Importa o componente de botão de voltar
import BackButton from '../dashboard/components/BackButton';

// Componente principal de layout para páginas de autenticação
export default function RootLayout({ children }) {
  // Obtém informações do usuário autenticado e do usuário no banco de dados
  const { user, DBUser } = useAuth();
  // Obtém o caminho atual da página
  const pathname = usePathname();
  // Obtém os parâmetros da URL
  const searchParams = useSearchParams();
  // Hook para navegação programática
  const router = useRouter();
  // Verifica se o modo mobile está ativado via parâmetro
  const mobileMode = searchParams.get("mobileMode");

  // Efeito colateral que verifica o estado de autenticação e redireciona conforme necessário
  useEffect(() => {
    // Se o usuário está autenticado e existe no banco de dados
    if (user && DBUser) {
      // Se o email do usuário está verificado, redireciona para o dashboard
      if (user.emailVerified) {
        router.push('/dashboard'); // Redireciona para o dashboard
      } 
      // Se o email não está verificado e não está nas rotas de verificação, redireciona para verificação de email
      else if (pathname !== "/auth/verify-email" && pathname !== "/auth/action") {
        router.push(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
      }
    }
  }, [user, DBUser, pathname, mobileMode, router]); // Dependências do efeito
  
  // Renderiza o layout com botão de voltar e os filhos (children)
  return (
    <>
      {/* Container para o botão de voltar */}
      <div className="max-w-4xl w-full">
        <BackButton />
      </div>
      {/* Renderiza os componentes filhos da rota */}
      {children}
    </>
  );
}