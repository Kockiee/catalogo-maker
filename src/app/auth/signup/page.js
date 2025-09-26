// Indica que este componente é um Client Component do Next.js
/**
 * Página de cadastro de novo usuário
 * Permite criar conta via email/senha ou Google
 * Exige aceitação dos termos de uso
 * Exibe mensagens de erro conforme necessário
 * @param {object} searchParams Parâmetros da URL
 * @returns {JSX.Element} Interface de cadastro
 */
// Indica que este componente é um Client Component do Next.js
'use client'

// Importa componente para exibir erros
import ErrorCard from '@/app/auth/components/ErrorCard';
// Importa contexto de autenticação para acessar funções
import { useAuth } from '@/app/contexts/AuthContext';
// Importa componentes de UI da Flowbite
import { Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react';
// Importa componente de link do Next.js
import Link from 'next/link';
// Importa hook de estado do React
import { useState } from 'react';
// Importa ícone do Google para botão social
import { FcGoogle } from "react-icons/fc";

// Componente principal para página de cadastro de usuário
export default function PAGE({searchParams}) {
    // Verifica se está no modo mobile via parâmetro
    const mobileMode = searchParams.mobileMode;
    // Estados para campos do formulário
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    // Estado para controle de aceitação dos termos
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    // Estado para mensagem de erro
    const [error, setError] = useState('');
    // Funções de autenticação e estado de loading
    const { signUpWithEmailAndPassword, signInWithGoogle, authLoading } = useAuth()

    // Middleware para garantir aceitação dos termos antes de executar ação
    const signUpMiddleware = async(action) => {
      if (isTermsAccepted) {
        await action();
      } else {
        setError("Você precisa aceitar os termos de uso e a política de privacidade antes de continuar.")
      }
    } 

    // Função para tratar envio do formulário de cadastro
    const handleSubmit = (e) => {
      e.preventDefault(); // Previne comportamento padrão do formulário
      signUpMiddleware(async() => {
        // Verifica se as senhas coincidem
        if (password === repeatedPassword) {
          try {
            // Tenta cadastrar usuário com email e senha
            await signUpWithEmailAndPassword(username, email, password)
          } catch (err) {
            setError("") // Limpa erro anterior
            // Trata erros específicos de email já existente, inválido ou senha fraca
            if (err.code == 'auth/email-already-in-use') {
              setError("Esse email já existe.")
            } else if (err.code == 'auth/invalid-email') {
              setError("O email digitado é inválido.")
            } else if (err.code == 'auth/weak-password') {
              setError("Sua senha tem que ter pelo menos 6 caracteres.")
            }
          }
        } else {
          setError("As senhas digitadas não coincidem")
        }
      })
    }

    // Função para tratar cadastro via Google
    const handleSignWithGoogle = () => {
      signUpMiddleware(async() => {
        try {
          await signInWithGoogle()
        } catch (err) {
          // Trata erro de email já existente
          if (err.code === 'auth/email-already-in-use') {
            setError(<Text className="text-base text-red-600 dark:text-red-400"><Text className="font-medium">Opa!</Text> Esse email já existe.</Text>)
          }
        }
      })
    }

    // Renderiza o formulário de cadastro e botão social
    return (
        <main className="flex justify-center items-center h-full">
            {/* Card centralizado para cadastro */}
            <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                <h1 className='font-bold text-xl'>Crie uma conta</h1>
                {/* Formulário de cadastro */}
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
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
                  <div>
                    <div className="mb-2 block">
                      <Label 
                      htmlFor="password" 
                      value="Sua senha" />
                    </div>
                    <TextInput
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("") // Limpa erro ao digitar
                    }} 
                    color="light"
                    id="password" 
                    type="password" 
                    placeholder="**********"
                    required 
                    shadow />
                  </div>
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
                      setError("") // Limpa erro ao digitar
                    }}
                    id="repeat-password" 
                    type="password"
                    placeholder="**********"
                    required 
                    shadow />
                  </div>
                  {/* Exibe mensagem de erro, se houver */}
                  <ErrorCard error={error}/>
                  {/* Checkbox para aceitar termos de uso e política de privacidade */}
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
                  {/* Link para login caso já tenha conta */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor='donthaveaccount' className="flex">
                      Já tem uma conta ?&nbsp;
                      <Link href={`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                        Entrar na conta
                      </Link>
                    </Label>
                  </div>
                  {/* Botão de envio do formulário */}
                  <Button type="submit" className='bg-neonblue hover:!bg-neonblue/80 focus:ring-0'>
                    {!authLoading ? <>Criar Conta</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}
                  </Button>
                </form>
                <p className='text-base'>ou</p>
                {/* Botão para cadastro via Google */}
                <Button 
                onClick={handleSignWithGoogle}
                className='inline-flex bg-gray-100 text-black hover:!bg-gray-200 border border-gray-200 focus:ring-0'>
                  <FcGoogle className='w-8 h-8'/> Continuar com Google
                </Button>
            </div>
        </main>
    )
}