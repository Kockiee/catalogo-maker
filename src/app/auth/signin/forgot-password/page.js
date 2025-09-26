/**
 * Página de recuperação de senha
 * Permite ao usuário solicitar email para redefinir senha
 * Exibe feedback visual de sucesso ou erro
 * @returns {JSX.Element} Interface de recuperação de senha
 */
// Indica que este componente é um Client Component do Next.js
'use client'

// Importa componente para exibir erros
import ErrorCard from "@/app/auth/components/ErrorCard"
// Importa contexto de autenticação para acessar funções
import { useAuth } from "@/app/contexts/AuthContext"
// Importa componentes de UI da Flowbite
import { Button, Spinner, TextInput, Toast } from "flowbite-react"
// Importa hook de estado do React
import { useState } from "react"
// Importa ícone para feedback visual
import { HiPaperAirplane } from "react-icons/hi"

// Componente para página de recuperação de senha
export default function forgotpassword() {
    // Estado para armazenar o email digitado
    const [email, setEmail] = useState("")
    // Estado para controlar exibição do Toast de sucesso
    const [emailInvited, setEmailInvited] = useState(false)
    // Função para enviar email de recuperação e estado de loading
    const { sendForgotPasswordEmail, authLoading } = useAuth()
    // Estado para mensagem de erro
    const [error, setError] = useState("")

    // Função para tratar envio do formulário
    const handleFormSubmit = async(e) => {
        e.preventDefault(); // Previne comportamento padrão do formulário
        try {
            // Tenta enviar email de recuperação de senha
            await sendForgotPasswordEmail(email)
            setEmailInvited(true) // Exibe Toast de sucesso
        } catch (err) {
            // Trata erros específicos de email inválido ou excesso de requisições
            if (err.code === 'auth/invalid-email') {
                setError("O email digitado é inválido.")
            } else if (err.code === 'auth/too-many-requests') {
                setError("O email já deve estar na sua caixa de entrada, caso não esteja aguarde um pouco e envie de novo.")
            }
        }
    }

    // Renderiza o formulário e feedback visual
    return  (
        <div className="w-full flex justify-center">
            {/* Card centralizado para recuperação de senha */}
            <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                <h1 className="text-xl font-bold">Esqueceu sua senha ?</h1>
                <div className="w-full">
                    <p>Fique tranquilo! Forneça seu email para que possamos confirmar sua identidade e então redefinir sua senha.</p>
                </div>
                {/* Formulário para envio do email */}
                <form className="w-full" onSubmit={handleFormSubmit}>
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
                    {/* Exibe mensagem de erro, se houver */}
                    <ErrorCard error={error}/>
                    <Button
                        type="submit"
                        className="w-full !bg-neonblue hover:!bg-neonblue/80 enabled:focus:ring-4 enabled:focus:outline-none enabled:focus:!ring-jordyblue"
                    >{!authLoading ? <>Enviar Email</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}</Button>
                </form>
            </div>
            {/* Toast de sucesso, aparece quando emailInvited é true */}
            <Toast className={`fixed border bottom-4 transition-opacity duration-300 ease-in-out opacity-100 ${emailInvited ? '' : 'opacity-0'}`}>
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