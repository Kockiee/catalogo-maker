/**
 * Página de Cadastro de Usuário
 * 
 * Esta página permite que novos usuários criem uma conta no sistema.
 * Oferece duas opções de cadastro: com email e senha ou através do Google.
 * Inclui validações de formulário, verificação de termos de uso e
 * tratamento de erros específicos do Firebase Authentication.
 */

'use client'
// Importa componente para exibição de erros
import ErrorCard from '@/app/auth/components/ErrorCard';
// Importa o contexto de autenticação
import { useAuth } from '@/app/contexts/AuthContext';
// Importa componentes da biblioteca Flowbite
import { Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react';
// Importa componente de link do Next.js
import Link from 'next/link';
// Importa hooks do React
import { useEffect, useState } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications'
// Importa navegação do Next.js
import { useRouter } from 'next/navigation';
// Importa ícone do Google
import { FcGoogle } from "react-icons/fc";

/**
 * Componente principal da página de cadastro
 * @param {object} searchParams - Parâmetros de busca da URL
 * @returns {JSX.Element} - Interface de cadastro de usuário
 */
export default function PAGE({searchParams}) {
    // Verifica se está no modo mobile através dos parâmetros da URL
    const mobileMode = searchParams.mobileMode;
    // Estado para armazenar o email digitado
    const [email, setEmail] = useState('');
    // Estado para armazenar o nome de usuário
    const [username, setUsername] = useState('');
    // Estado para armazenar a senha
    const [password, setPassword] = useState('');
    // Estado para armazenar a confirmação da senha
    const [repeatedPassword, setRepeatedPassword] = useState('');
    // Estado para controlar se os termos foram aceitos
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState('');
  const { notify } = useNotifications()
    // Obtém funções do contexto de autenticação
    const { signUpWithEmailAndPassword, signInWithGoogle, authLoading, user, DBUser } = useAuth()
    // Roteador
    const router = useRouter();

    // Redireciona usuários já autenticados e com email verificado
    useEffect(() => {
      if (user && DBUser && user.emailVerified) {
        router.push(`/dashboard${mobileMode ? "?mobileMode=True" : ""}`)
      }
    }, [user, DBUser, mobileMode, router]);

    /**
     * Middleware para verificar aceitação dos termos antes de executar ações
     * @param {function} action - Função a ser executada se os termos foram aceitos
     */
    const signUpMiddleware = async(action) => {
      // Verifica se os termos foram aceitos
      if (isTermsAccepted) {
        // Executa a ação se os termos foram aceitos
        await action();
      } else {
        // Exibe erro se os termos não foram aceitos
        setError("Você precisa aceitar os termos de uso e a política de privacidade antes de continuar.")
        notify.warning('Você precisa aceitar os termos de uso e a política de privacidade.')
      }
    } 

    /**
     * Função para processar o envio do formulário de cadastro
     * @param {Event} e - Evento de submit do formulário
     */
    const handleSubmit = (e) => {
      // Previne o comportamento padrão do formulário
      e.preventDefault();
      // Executa o middleware de verificação de termos
      signUpMiddleware(async() => {
        // Verifica se as senhas coincidem
        if (password === repeatedPassword) {
          try {
            // Tenta criar a conta com email e senha
            await signUpWithEmailAndPassword(username, email, password)
          } catch (err) {
            // Limpa erros anteriores
            setError("")
            // Trata diferentes tipos de erro do Firebase
            if (err.code == 'auth/email-already-in-use') {
              setError("Esse email já existe.")
              notify.error('Esse email já existe.')
            } else if (err.code == 'auth/invalid-email') {
              setError("O email digitado é inválido.")
              notify.error('O email digitado é inválido.')
            } else if (err.code == 'auth/weak-password') {
              setError("Sua senha tem que ter pelo menos 6 caracteres.")
              notify.error('Sua senha tem que ter pelo menos 6 caracteres.')
            }
          }
        } else {
          // Exibe erro se as senhas não coincidem
          setError("As senhas digitadas não coincidem")
        }
      })
    }

    /**
     * Função para processar cadastro com Google
     */
    const handleSignWithGoogle = () => {
      // Executa o middleware de verificação de termos
      signUpMiddleware(async() => {
        try {
          // Tenta fazer login com Google
          await signInWithGoogle()
        } catch (err) {
          // Trata erro de email já em uso
          if (err.code === 'auth/email-already-in-use') {
            setError(<Text className="text-base text-red-600 dark:text-red-400"><Text className="font-medium">Opa!</Text> Esse email já existe.</Text>)
          }
        }
      })
    }

    return (
        <main className="flex justify-center items-center h-full">
            {/* Card principal do formulário de cadastro */}
            <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                {/* Título da página */}
                <h1 className='font-bold text-xl'>Crie uma conta</h1>
                {/* Formulário de cadastro */}
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                  {/* Campo de nome de usuário */}
                  <div>
                    <div className="mb-2 block">
                      <Label 
                      htmlFor="username" 
                      value="Seu nome de usuário" />
                    </div>
                    <TextInput
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    color="light"
                    id="username" 
                    type="text"
                    placeholder="John_Doe123" 
                    required 
                    shadow />
                  </div>
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
                  {/* Campo de confirmação de senha */}
                  <div>
                    <div className="mb-2 block">
                      <Label 
                      htmlFor="repeat-password" 
                      value="Repita a senha" />
                    </div>
                    <TextInput
                    color="light"
                    onChange={(e) => {
                      setRepeatedPassword(e.target.value);
                      setError("")
                    }}
                    id="repeat-password" 
                    type="password"
                    placeholder="**********"
                    required 
                    shadow />
                  </div>
                  {/* Componente para exibir erros */}
                  <ErrorCard error={error}/>
                  {/* Checkbox para aceitar termos de uso */}
                  <div className="flex items-center gap-2">
                    <Checkbox className='w-6 h-6 mr-2' onChange={(e) => setIsTermsAccepted(e.target.checked)} id="agree" required color="blue"/>
                    <Label htmlFor="agree">
                      Eu concordo com os&nbsp;
                      <Link href={`/use-terms${mobileMode ? "?mobileMode=True" : ""}`} className="inline-flex text-neonblue hover:underline dark:text-cyan-500">
                        termos de uso
                      </Link> e as <Link href={`/privacy-policy${mobileMode ? "?mobileMode=True" : ""}`} className="inline-flex text-neonblue hover:underline dark:text-cyan-500">
                        políticas de privacidade
                      </Link>
                    </Label>
                  </div>
                  {/* Link para página de login */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor='donthaveaccount' className="flex">
                      Já tem uma conta ?&nbsp;
                      <Link href={`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                        Entrar na conta
                      </Link>
                    </Label>
                  </div>
                  {/* Botão de submit do formulário */}
                  <Button type="submit" className='bg-neonblue hover:!bg-neonblue/80 focus:ring-0'>
                    {!authLoading ? <>Criar Conta</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}
                  </Button>
                </form>
                {/* Separador visual */}
                <p className='text-base'>ou</p>
                {/* Botão de cadastro com Google */}
                <Button 
                onClick={handleSignWithGoogle}
                className='inline-flex bg-gray-100 text-black hover:!bg-gray-200 border border-gray-200 focus:ring-0'>
                  <FcGoogle className='w-8 h-8'/> Continuar com Google
                </Button>
            </div>
        </main>
    )
}