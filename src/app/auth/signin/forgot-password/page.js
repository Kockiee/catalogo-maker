/**
 * Página de Recuperação de Senha
 * 
 * Esta página permite que usuários solicitem o reenvio de um email para
 * redefinir sua senha caso tenham esquecido. Envia um link seguro por email
 * que permite ao usuário criar uma nova senha sem precisar da senha atual.
 */

'use client'
// Importa componente para exibição de erros
import ErrorCard from "@/app/auth/components/ErrorCard"
// Importa o contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext"
// Importa componentes da biblioteca Flowbite
import { Button, Spinner, TextInput, Toast } from "flowbite-react"
// Importa hook useState para gerenciar estado local
import { useState } from "react"
// Importa ícone de avião de papel
import { HiPaperAirplane } from "react-icons/hi"

/**
 * Componente principal da página de recuperação de senha
 * @returns {JSX.Element} - Interface para recuperação de senha
 */
export default function forgotpassword() {
    // Estado para armazenar o email digitado
    const [email, setEmail] = useState("")
    // Estado para controlar se o email foi enviado com sucesso
    const [emailInvited, setEmailInvited] = useState(false)
    // Obtém funções do contexto de autenticação
    const { sendForgotPasswordEmail, authLoading } = useAuth()
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState("")

    /**
     * Função para processar o envio do formulário de recuperação
     * @param {Event} e - Evento de submit do formulário
     */
    const handleFormSubmit = async(e) => {
        // Previne o comportamento padrão do formulário
        e.preventDefault();
        try {
            // Tenta enviar email de recuperação de senha
            await sendForgotPasswordEmail(email)
            // Marca que o email foi enviado com sucesso
            setEmailInvited(true)
        } catch (err) {
            // Trata diferentes tipos de erro do Firebase
            if (err.code === 'auth/invalid-email') {
                setError("O email digitado é inválido.")
            } else if (err.code === 'auth/too-many-requests') {
                setError("O email já deve estar na sua caixa de entrada, caso não esteja aguarde um pouco e envie de novo.")
            }
        }
    }

    return  (
        <div className="w-full flex justify-center">
            {/* Card principal do formulário de recuperação */}
            <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                {/* Título da página */}
                <h1 className="text-xl font-bold">Esqueceu sua senha ?</h1>
                {/* Texto explicativo */}
                <div className="w-full">
                    <p>Fique tranquilo! Forneça seu email para que possamos confirmar sua identidade e então redefinir sua senha.</p>
                </div>
                {/* Formulário de recuperação */}
                <form className="w-full" onSubmit={handleFormSubmit}>
                    {/* Campo de email */}
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
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
                    {/* Componente para exibir erros */}
                    <ErrorCard error={error}/>
                    {/* Botão de envio do formulário */}
                    <Button
                        type="submit"
                        className="w-full !bg-neonblue hover:!bg-neonblue/80 enabled:focus:ring-4 enabled:focus:outline-none enabled:focus:!ring-jordyblue"
                    >{!authLoading ? <>Enviar Email</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}</Button>
                </form>
            </div>
            {/* Toast de notificação de sucesso */}
            <Toast className={`fixed border bottom-4 transition-opacity duration-300 ease-in-out opacity-100 ${emailInvited ? '' : 'opacity-0'}`}>
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