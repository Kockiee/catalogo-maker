/**
 * Página de Login de Usuário
 * 
 * Esta página permite que usuários existentes façam login no sistema.
 * Oferece duas opções de autenticação: com email e senha ou através do Google.
 * Inclui validações de formulário e tratamento de erros específicos
 * do Firebase Authentication.
 */

'use client'

// Importa componente para exibição de erros
import ErrorCard from '@/app/auth/components/ErrorCard';
// Importa o contexto de autenticação
import { useAuth } from '@/app/contexts/AuthContext';
// Importa componentes da biblioteca Flowbite
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
// Importa componente de link do Next.js
import Link from 'next/link';
// Importa hooks do React
import { useEffect, useState } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications';
// Importa navegação do Next.js
import { useRouter } from 'next/navigation';
// Importa ícone do Google
import { FcGoogle } from "react-icons/fc";

/**
 * Componente principal da página de login
 * @param {object} searchParams - Parâmetros de busca da URL
 * @returns {JSX.Element} - Interface de login de usuário
 */
export default function PAGE({searchParams}) {
  // Verifica se está no modo mobile através dos parâmetros da URL
  const mobileMode = searchParams.mobileMode === "True";
  // Estado para armazenar o email digitado
  const [email, setEmail] = useState('');
  // Estado para armazenar a senha
  const [password, setPassword] = useState('');
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState('');
  const { notify } = useNotifications();
  // Obtém funções do contexto de autenticação
  const { signInWithGoogle, loginWithEmailAndPassword, authLoading, user, DBUser } = useAuth();
  // Roteador para redirecionamentos
  const router = useRouter();

  // Redireciona usuários já autenticados e com email verificado
  useEffect(() => {
    if (user && DBUser && user.emailVerified) {
      router.push(`/dashboard${mobileMode ? "?mobileMode=True" : ""}`)
    }
  }, [user, DBUser, mobileMode, router]);

  /**
   * Função para processar o envio do formulário de login
   * @param {Event} e - Evento de submit do formulário
   */
  const handleSubmit = async(e) => {
    // Previne o comportamento padrão do formulário
    e.preventDefault();
    try {
      // Tenta fazer login com email e senha
      await loginWithEmailAndPassword(email, password)
    } catch (err) {
      // Trata diferentes tipos de erro do Firebase
      if (err.code == 'auth/user-not-found') {
        notify.error('Não encontramos sua conta.');
      } else if (err.code == 'auth/invalid-email') {
        notify.error('O email digitado é inválido.');
      } else if (err.code == 'auth/wrong-password') {
        notify.error('Senha incorreta.');
      } else if (err.code == 'auth/too-many-requests') {
        notify.warning('Muitas tentativas. Tente novamente mais tarde.');
      } else if (err.code == 'auth/invalid-credential') {
        notify.error('Credenciais inválidas.');
      }
    }
  }

  /**
   * Função para processar login com Google
   */
  const handleSignWithGoogle = async() => {
    try {
      // Tenta fazer login com Google
      await signInWithGoogle()
    } catch (err) {
      // Trata erro de email já em uso
      if (err.code === 'auth/email-already-in-use') {
        notify.error('Esse email já existe.');
      }
    }
  }

  return (
    <main className="flex justify-center items-center h-full">
      {/* Card principal do formulário de login */}
      <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
        {/* Título da página */}
        <h1 className='font-bold text-xl'>Entre em sua conta</h1>
        {/* Formulário de login */}
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          {/* Campo de email */}
          <div>
            <div className="mb-2 block">
              <Label 
              htmlFor="email" 
              value="Seu email" />
            </div>
            <TextInput
            onChange={(e) => {
              setEmail(e.target.value);
            }} 
            color="light"
            id="email" 
            type="email"
            placeholder="nome@catalogomaker.com" 
            required 
            shadow />
          </div>
          {/* Campo de senha */}
          <div>
            <div className="mb-2 block">
              <Label 
              htmlFor="password" 
              value="Sua senha" />
            </div>
            <TextInput
            onChange={(e) => {
              setPassword(e.target.value);
              setError("")
            }} 
            color="light"
            id="password" 
            type="password" 
            placeholder="**********"
            required 
            shadow />
          </div>
          {/* Componente para exibir erros */}
          <ErrorCard error={error}/>
          {/* Link para página de cadastro */}
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Não tem uma conta ?&nbsp;
              <Link href={`/auth/signup${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                Criar uma conta
              </Link>
            </Label>
          </div>
          {/* Link para página de recuperação de senha */}
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Esqueceu a senha ?&nbsp;
              <Link href={`/auth/signin/forgot-password${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                Redefinir agora
              </Link>
            </Label>
          </div>
          {/* Botão de submit do formulário */}
          <Button type="submit" className='bg-neonblue hover:!bg-neonblue/80 focus:ring-0'>
            {!authLoading ? <>Entrar na conta</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}
          </Button>
        </form>
        {/* Separador visual */}
        <p className='text-base'>ou</p>
        {/* Botão de login com Google */}
        <Button 
        onClick={handleSignWithGoogle}
        className='inline-flex bg-gray-100 text-black hover:!bg-gray-200 border border-gray-200 focus:ring-0'>
          <FcGoogle className='w-8 h-8'/> Continuar com Google
        </Button>
      </div>
    </main>
  )
}