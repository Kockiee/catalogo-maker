/**
 * Página de ação de autenticação (verificação de email ou redefinição de senha)
 * Decide o fluxo conforme parâmetros da URL
 * Interage com contexto de autenticação para executar operações
 * @param {object} searchParams Parâmetros da URL
 * @returns {JSX.Element} Interface de ação de autenticação
 */
// Indica que este componente é um Client Component do Next.js
'use client'

// Importa o contexto de autenticação para acessar funções e estados
import { useAuth } from "@/app/contexts/AuthContext"
// Importa funções de navegação do Next.js
import { redirect, useSearchParams } from "next/navigation"
// Importa hooks do React para estado e efeito colateral
import { useEffect, useState } from "react"
// Importa componentes de UI da Flowbite
import { Button, Spinner, TextInput } from "flowbite-react"
// Importa componente para exibir erros
import ErrorCard from "@/app/auth/components/ErrorCard"

// Componente principal para ações de autenticação (verificar email ou redefinir senha)
export default function PAGE({searchParams}) {
    // Obtém funções e estados do contexto de autenticação
    const { resetPassword, verifyEmail, authLoading } = useAuth()
    // Estado para armazenar a nova senha
    const [password, setPassword] = useState("")
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState("")

    // Obtém parâmetros da URL
    const mobileMode = searchParams.mobileMode
    const oobCode = searchParams.oobCode // Código de operação (reset/verificação)
    const mode = searchParams.mode // Modo da ação (verifyEmail ou resetPassword)

    // Efeito colateral para verificar email ou redirecionar se não houver código
    useEffect(() => {
        // Função assíncrona para enviar verificação de email
        async function sendVerifyEmail() {
            try {
                await verifyEmail(oobCode)
            } catch (err) {
                // Se o código de ação é inválido, exibe erro
                if (err.code === "auth/invalid-action-code") {
                    setError("Código ou URL de verificação inválido !")
                }
            }
        }
        // Se não há código, redireciona para login
        if (!oobCode) {
            redirect(`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`)
        }
        // Se o modo é verificação de email, executa a função
        if (mode === 'verifyEmail') {
            sendVerifyEmail()
        }
    }, []) // Executa apenas uma vez ao montar
    
    // Função para tratar o envio do formulário de redefinição de senha
    const handleResetPasswordFormSubmit = async(e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        try {
            // Tenta redefinir a senha usando o código e a nova senha
            await resetPassword(oobCode, password)
        } catch (err) {
            setError("") // Limpa erro anterior
            // Trata erros específicos de senha fraca ou código inválido
            if (err.code == 'auth/weak-password') {
                setError("Sua senha tem que ter pelo menos 6 caracteres.")
            } else if (err.code == 'auth/invalid-action-code') {
                setError("Parece que esse link de redefinição de senha expirou, tente novamente.")
            }
        }
    }

    // Renderização condicional baseada no modo (verificar email ou redefinir senha)
    return (
        <>
        {/* Se o modo é verificação de email */}
        {mode === "verifyEmail" ? (
            <div className="w-full">
                <div className="w-full h-full">
                    {/* Se não há erro, mostra spinner de verificação */}
                    {!error ? (
                        <div className="flex flex-col items-center">
                            <Spinner className="text-lightcyan" size={'lg'}></Spinner>
                            <p>Verificando seu E-mail...</p>
                        </div>
                    ): (
                        // Se há erro, exibe o componente de erro
                        <ErrorCard error={error}/>
                    )}
                </div>
            </div>
        ) : mode === "resetPassword" && (
            // Se o modo é redefinição de senha, exibe formulário
            <div className="w-full flex justify-center">
                <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                    <h1 className="text-xl font-bold">Redefina sua senha</h1>
                    <form className="w-full" onSubmit={handleResetPasswordFormSubmit}>
                        <div className="mb-3">
                            <label className="text-base" htmlFor="email">Nova senha</label>
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
                        {/* Exibe mensagem de erro, se houver */}
                        <ErrorCard error={error}/>
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