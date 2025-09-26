/**
 * Página para envio de verificação de email
 * Permite ao usuário solicitar link de verificação
 * Exibe feedback visual de sucesso ou erro
 * @returns {JSX.Element} Interface de verificação de email
 */
// Indica que este componente é um Client Component do Next.js
'use client'

// Importa hook de estado do React
import { useState } from "react";
// Importa contexto de autenticação para acessar funções e dados do usuário
import { useAuth } from "../../contexts/AuthContext";
// Importa componentes de UI da Flowbite
import { Button, Spinner, Toast } from "flowbite-react";
// Importa ícone para feedback visual
import { HiPaperAirplane } from "react-icons/hi";
// Importa componente para exibir erros
import ErrorCard from "@/app/auth/components/ErrorCard";

// Componente para página de verificação de email
export default function PAGE() {
    // Estado para controlar exibição do Toast de sucesso
    const [emailInvited, setEmailInvited] = useState(false)
    // Estado para mensagem de erro
    const [error, setError] = useState("")
    // Função para enviar email de verificação, estado de loading e dados do usuário
    const { signUpEmailVerification, authLoading, user } = useAuth()

    // Função para tratar envio do email de verificação
    const handleVerifyEmail = async() => {
      try {
        // Tenta enviar email de verificação
        await signUpEmailVerification()
        setEmailInvited(true) // Exibe Toast de sucesso
      } catch (err) {
        setError("") // Limpa erro anterior
        // Trata erros específicos de email inválido ou excesso de requisições
        if (err.code === 'auth/invalid-email') {
            setError("O email digitado é inválido.")
        } else if (err.code === 'auth/too-many-requests') {
            setError("O email já deve estar na sua caixa de entrada, caso não esteja aguarde um pouco e envie de novo.")
        }
      }
    }
    
    // Renderiza o card de verificação de email e feedback visual
    return (
      <div className="w-full flex justify-center">
        {/* Card centralizado para verificação de email */}
        <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
          <h1 className="text-xl font-bold">Verifique seu Email</h1>
          <p>Para sua segurança é necessário fazer uma breve verificação de email. Enviaremos um link para seu email ({user && user.email}) assim que você clicar no botão abaixo.</p>
          {/* Botão para enviar email de verificação */}
          <Button onClick={handleVerifyEmail} className="w-full !bg-neonblue hover:!bg-neonblue/80 enabled:focus:ring-4 enabled:focus:outline-none enabled:focus:!ring-jordyblue">
            {!authLoading ? <>Enviar Email</> : <Spinner color={'warning'} size={'md'}></Spinner>}
          </Button>
          {/* Exibe mensagem de erro, se houver */}
          <ErrorCard error={error}/>
        </div>
        {/* Toast de sucesso, aparece quando emailInvited é true */}
        <Toast className={`fixed border bottom-24 transition-opacity duration-300 ease-in-out opacity-100 ${emailInvited ? '' : 'opacity-0'}`}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiPaperAirplane className="w-6 h-6 rotate-45"/>
          </div>
          <div className="ml-3 text-md font-normal">
            Email enviado com sucesso
          </div>
          {/* Botão para fechar o Toast */}
          <Toast.Toggle theme={'auto'} onDismiss={() => setEmailInvited(false)}/>
        </Toast>
      </div>
    )
}