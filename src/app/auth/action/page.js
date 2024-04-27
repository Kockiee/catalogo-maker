'use client'
import { useAuth } from "@/app/contexts/AuthContext"
import { redirect, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button, Spinner, TextInput } from "flowbite-react"

export default function PAGE({searchParams}) {
    const { resetPassword, verifyEmail, authLoading } = useAuth()
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const searchParams = useSearchParams();
    const mobileMode = searchParams.get("mobileMode");

    const oobCode = searchParams.oobCode
    const mode = searchParams.mode

    useEffect(() => {
        async function sendVerifyEmail() {
            try {
                await verifyEmail(oobCode)
            } catch (err) {
                if (err.code === "auth/invalid-action-code") {
                    setError("Código ou URL de verificação inválido !")
                }
            }
        }
        if (!oobCode) {
            redirect(`/login${mobileMode && "?mobileMode=True"}`)
        }
        if (mode === 'verifyEmail') {
            sendVerifyEmail()
        }
    }, [])
    
    
    const handleResetPasswordFormSubmit = async(e) => {
        e.preventDefault();
        try {
            await resetPassword(oobCode, password)
        } catch (err) {
            setError("")
            if (err.code == 'auth/weak-password') {
                setError("Sua senha tem que ter pelo menos 6 caracteres.")
            } else if (err.code == 'auth/invalid-action-code') {
                setError("Parece que esse link de redefinição de senha expirou, tente novamente.")
            }
        }
    }

    return (
        <>
        {mode === "verifyEmail" ? (
            <div className="w-full">
                <div className="w-full h-full">
                    {!error ? (
                        <div className="flex flex-col items-center">
                            <Spinner className="text-lightcyan" size={'lg'}></Spinner>
                            <p>Verificando seu E-mail...</p>
                        </div>
                    ): (
                        <p className='text-red-600 text-sm'>{error}</p>
                    )}
                </div>
            </div>
        ) : mode === "resetPassword" && (
            <div className="w-full flex justify-center">
                <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                    <h1 className="text-xl font-bold">Redefina sua senha</h1>
                    <form className="w-full" onSubmit={handleResetPasswordFormSubmit}>
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
                        <p className='text-red-600 text-sm'>{error}</p>
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