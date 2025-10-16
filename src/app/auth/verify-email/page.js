/**
 * Página de Verificação de Email
 * 
 * Esta página permite que usuários solicitem o reenvio do email de verificação
 * caso não tenham recebido ou tenham perdido o email original. É exibida
 * automaticamente para usuários que se cadastraram mas ainda não verificaram
 * seu endereço de email.
 */

"use client"
// Importa o hook useState para gerenciar estado local
import { useState } from "react";
// Importa o contexto de autenticação
import { useAuth } from "../../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
// Importa componentes da biblioteca Flowbite
import { Button, Spinner, Toast } from "flowbite-react";
// Importa ícone de avião de papel
import { HiPaperAirplane } from "react-icons/hi";
// Importa componente de exibição de erros
import ErrorCard from "@/app/auth/components/ErrorCard";
import ButtonAPP from "@/app/components/ButtonAPP";

/**
 * Componente principal da página de verificação de email
 * @returns {JSX.Element} - Interface para reenvio de email de verificação
 */
export default function PAGE() {
    // Estado para controlar se o email foi enviado com sucesso
    const [emailInvited, setEmailInvited] = useState(false)
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState("")
    // Obtém funções e dados do contexto de autenticação
    const { signUpEmailVerification, authLoading, user, refreshCurrentUser } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const mobileMode = searchParams.get("mobileMode") === "True"

    /**
     * Função para enviar email de verificação
     * Gerencia o processo de reenvio do email de verificação
     */
    const handleVerifyEmail = async() => {
      try {
        // Chama a função de envio de email de verificação
        await signUpEmailVerification()
        // Marca que o email foi enviado com sucesso
        setEmailInvited(true)
      } catch (err) {
        // Limpa erros anteriores
        setError("")
        // Trata diferentes tipos de erro do Firebase
        if (err.code === 'auth/invalid-email') {
            setError("O email digitado é inválido.")
        } else if (err.code === 'auth/too-many-requests') {
            setError("O email já deve estar na sua caixa de entrada, caso não esteja aguarde um pouco e envie de novo.")
        }
      }
    }

    const handleContinue = async () => {
      // Recarrega o estado do usuário e verifica se o email foi verificado
      const current = await refreshCurrentUser()
      if (current && current.emailVerified) {
        router.push(`/dashboard${mobileMode ? "?mobileMode=True" : ""}`)
      } else {
        setError("Ainda não confirmamos sua verificação. Confira seu email e tente novamente em instantes.")
      }
    }
    
    return (
      <div className="w-full flex justify-center">
        {/* Card principal com formulário de verificação */}
        <div className="rounded-lg max-w-xl w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
          {/* Título da página */}
          <h1 className="text-xl font-bold">Verifique seu Email</h1>
          {/* Texto explicativo com email do usuário */}
          <p>Para sua segurança é necessário fazer uma breve verificação de email. Enviaremos um link para seu email <span className="font-bold">{user && user.email}</span> assim que você clicar no botão abaixo.</p>
          <p>Caso não receba o email, verifique sua caixa de spam ou solicite um novo envio.</p>
          {/* Botão para enviar email de verificação */}
          <ButtonAPP onClick={handleVerifyEmail} className="w-full">
            {/* Mostra texto ou spinner baseado no estado de carregamento */}
            {!authLoading ? <>Enviar Email</> : <Spinner color={'info'} size={'md'}></Spinner>}
          </ButtonAPP>
          {/* Exibe botão de continuar após o envio do email */}
          {emailInvited && (
            <Button onClick={handleContinue} className="w-full !bg-green-400 hover:!bg-green-500 focus:!ring-green-200">
              Continuar para o Dashboard
            </Button>
          )}
          {/* Componente para exibir erros */}
          <ErrorCard error={error}/>
        </div>
        {/* Toast de notificação de sucesso */}
        <Toast className={`fixed border bottom-24 transition-opacity duration-300 ease-in-out opacity-100 ${emailInvited ? '' : 'opacity-0'}`}>
          {/* Ícone de sucesso */}
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiPaperAirplane className="w-6 h-6 rotate-45"/>
          </div>
          {/* Mensagem de sucesso */}
          <div className="ml-3 text-md font-normal">
            Email enviado com sucesso
          </div>
          {/* Botão para fechar o toast */}
          <Toast.Toggle theme={'auto'} onDismiss={() => setEmailInvited(false)}/>
        </Toast>
      </div>
    )
}