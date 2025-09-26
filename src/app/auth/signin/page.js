'use client'

// Importação de componentes de erro e UI
import ErrorCard from '@/app/auth/components/ErrorCard';
// Importação do contexto de autenticação
import { useAuth } from '@/app/contexts/AuthContext';
// Importação de componentes do Flowbite React para formulários
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
// Importação do componente Link do Next.js para navegação
import Link from 'next/link';
// Importação do hook useState do React para gerenciar estado local
import { useState } from 'react';
// Importação do ícone do Google
import { FcGoogle } from "react-icons/fc";

/**
 * Página de login da aplicação
 * Permite autenticação via email/senha ou Google
 * @param {Object} searchParams - Parâmetros de busca da URL
 * @param {string} searchParams.mobileMode - Indica se deve usar layout móvel
 * @returns {JSX.Element} Interface de login
 */
export default function PAGE({searchParams}) {
    // Verifica se o modo móvel está ativado através dos parâmetros da URL
    const mobileMode = searchParams.mobileMode === "True";
    // Estados para armazenar dados do formulário
    const [email, setEmail] = useState('');           // Email digitado pelo usuário
    const [password, setPassword] = useState('');      // Senha digitada pelo usuário
    const [error, setError] = useState('');           // Mensagens de erro
    // Desestruturação das funções de autenticação do contexto
    const { signInWithGoogle, loginWithEmailAndPassword, authLoading } = useAuth();

    /**
     * Função para lidar com o envio do formulário de login
     * Valida as credenciais e trata diferentes tipos de erro
     * @param {Event} e - Evento de submit do formulário
     */
    const handleSubmit = async(e) => {
        e.preventDefault();  // Previne o comportamento padrão do formulário
        try {
            // Tenta fazer login com email e senha
            await loginWithEmailAndPassword(email, password)
        } catch (err) {
            // Trata diferentes tipos de erro de autenticação
            if (err.code == 'auth/user-not-found') {
                setError("Não encontramos sua conta.")
            } else if (err.code == 'auth/invalid-email') {
                setError("O email digitado é inválido.")
            } else if (err.code == 'auth/wrong-password') {
                setError("Sua senha está errada.")
            } else if (err.code == 'auth/too-many-requests') {
                setError("Muitas tentativas! Tente novamente mais tarde ou mude a sua senha.")
            } else if (err.code == 'auth/invalid-credential') {
                setError("As credenciais fornecidas são inválidas.")
            }
        }
    }

    /**
     * Função para lidar com o login via Google
     * Trata erros específicos do Google Sign-In
     */
    const handleSignWithGoogle = async() => {
        try {
            // Tenta fazer login com Google
            await signInWithGoogle()
        } catch (err) {
            // Trata erro específico de email já em uso
            if (err.code === 'auth/email-already-in-use') {
                setError(<Text className="text-base text-red-600 dark:text-red-400"><Text className="font-medium">Opa!</Text> Esse email já existe.</Text>)
            }
        }
    }

  // Renderiza a interface de login
  return (
    <main className="flex justify-center items-center h-full">
      {/* Container principal do formulário de login */}
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
              setEmail(e.target.value);  // Atualiza estado do email
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
              setPassword(e.target.value); // Atualiza estado da senha
              setError("")                // Limpa erros ao digitar
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
          {/* Link para criar nova conta */}
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Não tem uma conta ?&nbsp;
              <Link href={`/auth/signup${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                Criar uma conta
              </Link>
            </Label>
          </div>
          {/* Link para redefinir senha */}
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Esqueceu a senha ?&nbsp;
              <Link href={`/auth/signin/forgot-password${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                Redefinir agora
              </Link>
            </Label>
          </div>
          {/* Botão de login */}
          <Button type="submit" className='bg-neonblue hover:!bg-neonblue/80 focus:ring-0'>
            {/* Texto dinâmico baseado no estado de carregamento */}
            {!authLoading ? <>Entrar na conta</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}
          </Button>
        </form>
        {/* Separador */}
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