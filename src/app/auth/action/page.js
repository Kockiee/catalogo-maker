/**
 * Página de Ação de Autenticação
 * 
 * Esta página processa ações de autenticação vindas de links enviados por email,
 * como verificação de email e redefinição de senha. Funciona como um hub central
 * que determina qual ação executar baseado nos parâmetros da URL e executa
 * a operação correspondente do Firebase Authentication.
 */

'use client'
// Importa o contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext"
// Importa funções de navegação do Next.js
import { useSearchParams } from "next/navigation"
// Importa hooks do React
import { useEffect, useState } from "react"
// Importa componentes da biblioteca Flowbite
import { Button, Spinner, TextInput } from "flowbite-react"
// Importa componente de exibição de erros
import ErrorCard from "@/app/auth/components/ErrorCard"
import ButtonAPP from "@/app/components/ButtonAPP"
import { useNotifications } from '@/app/hooks/useNotifications'

/**
 * Componente principal da página de ação
 * @param {object} searchParams - Parâmetros de busca da URL
 * @returns {JSX.Element} - Interface para ações de autenticação
 */
export default function PAGE({searchParams}) {
    // Obtém funções do contexto de autenticação
    const { resetPassword, verifyEmail, authLoading } = useAuth()
    // Estado para armazenar a nova senha (para redefinição)
    const [password, setPassword] = useState("")
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState("")
    const { notify } = useNotifications()
    // Estado para indicar verificação concluída com sucesso
    const [verified, setVerified] = useState(false)

    // Extrai parâmetros da URL
    const oobCode = searchParams.oobCode        // Código de ação do Firebase
    const mode = searchParams.mode              // Tipo de ação (verifyEmail, resetPassword)

    // Efeito que executa ações baseadas nos parâmetros da URL
    useEffect(() => {
        /**
         * Função para verificar email automaticamente
         */
        async function sendVerifyEmail() {
            try {
                // Tenta verificar o email usando o código da URL
                await verifyEmail(oobCode)
                setVerified(true)
                notify.success('Email verificado com sucesso!')
            } catch (err) {
                // Trata erro de código inválido
                if (err.code === "auth/invalid-action-code") {
                    setError("Código ou URL de verificação inválido!")
                    notify.error('Código ou link de verificação inválido ou expirado.')
                }
            }
        }
        
        // Se o modo é verificação de email, executa automaticamente
        if (mode === 'verifyEmail') {
            if (!oobCode) {
                setError("Link de verificação inválido ou expirado.")
                return
            }
            sendVerifyEmail()
        }
    }, [])
    
    /**
     * Função para processar redefinição de senha
     * @param {Event} e - Evento de submit do formulário
     */
    const handleResetPasswordFormSubmit = async(e) => {
        // Previne o comportamento padrão do formulário
        e.preventDefault();
        try {
            // Tenta redefinir a senha usando o código e nova senha
            await resetPassword(oobCode, password)
        } catch (err) {
            // Limpa erros anteriores
            setError("")
            // Trata diferentes tipos de erro do Firebase
            if (err.code == 'auth/weak-password') {
                setError("Sua senha tem que ter pelo menos 6 caracteres.")
                notify.error('Sua senha tem que ter pelo menos 6 caracteres.')
            } else if (err.code == 'auth/invalid-action-code') {
                setError("Parece que esse link de redefinição de senha expirou, tente novamente.")
                notify.error('Link de redefinição expirado ou inválido. Solicite um novo e tente novamente.')
            }
        }
    }

    return (
        <>
        {/* Renderiza interface baseada no tipo de ação */}
        {mode === "verifyEmail" ? (
            /* Interface para verificação de email */
            <div className="w-full">
                <div className="w-full h-full">
                    {/* Se há erro, mostra mensagem de erro; senão mostra sucesso ou carregando */}
                    {error ? (
                        <ErrorCard error={error}/>
                    ) : verified ? (
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-xl font-semibold text-neonblue">Email verificado com sucesso!</p>
                            <p className="text-base text-gray-700">Você já pode retornar ao aplicativo e acessar sua conta.</p>
                            <ButtonAPP href="/dashboard">Continuar para o dashboard</ButtonAPP>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Spinner className="text-lightcyan" size={'lg'}></Spinner>
                            <p>Verificando seu e-mail...</p>
                        </div>
                    )}
                </div>
            </div>
        ) : mode === "resetPassword" && (
            /* Interface para redefinição de senha */
            <div className="w-full flex justify-center">
                {/* Card principal do formulário de redefinição */}
                <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                    {/* Título da página */}
                    <h1 className="text-xl font-bold">Redefina sua senha</h1>
                    {/* Formulário de redefinição */}
                    <form className="w-full" onSubmit={handleResetPasswordFormSubmit}>
                        {/* Campo de nova senha */}
                        <div className="mb-3">
                            <label className="text-base" htmlFor="email">Nova senha</label>
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
                        {/* Botão de submit do formulário */}
                        <Button
                            type="submit"
                            className="w-full !bg-neonblue hover:!bg-neonblue/80 enabled:focus:ring-4 enabled:focus:outline-none enabled:focus:!ring-jordyblue"
                        >{!authLoading ? <>Redefinir Senha</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}</Button>
                    </form>
                </div>
            </div>
        )}
        </>
    )
}