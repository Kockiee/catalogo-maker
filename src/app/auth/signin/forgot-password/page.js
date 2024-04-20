'use client'
import { useAuth } from "@/app/contexts/AuthContext"
import { Button, Spinner, TextInput, Toast } from "flowbite-react"
import { useState } from "react"
import { HiPaperAirplane } from "react-icons/hi"

export default function forgotpassword() {
    const [email, setEmail] = useState("")
    const [emailInvited, setEmailInvited] = useState(false)
    const { sendForgotPasswordEmail, authLoading } = useAuth()
    const [error, setError] = useState()


    const handleFormSubmit = async(e) => {
        e.preventDefault();
        try {
            await sendForgotPasswordEmail(email)
            setEmailInvited(true)
        } catch (err) {
            if (err.code === 'auth/invalid-email') {
                setError("O email digitado é inválido.")
            } else if (err.code === 'auth/too-many-requests') {
                setError("O email já deve estar na sua caixa de entrada, caso não esteja aguarde um pouco e envie de novo.")
            }
        }
    }

    return  (
        <div className="w-full flex justify-center">
            <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                <h1 className="text-xl font-bold">Esqueceu sua senha ?</h1>
                <div className="w-full">
                    <p>Fique tranquilo! Forneça seu email para que possamos confirmar sua identidade e então redefinir sua senha.</p>
                </div>
                <form className="w-full" onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label className="text-lg font-bold" htmlFor="email">Email</label>
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
                    <p className='text-red-600 text-sm'>{error}</p>
                    <Button
                        type="submit"
                        className="w-full !bg-neonblue hover:!bg-neonblue/80 enabled:focus:ring-4 enabled:focus:outline-none enabled:focus:!ring-jordyblue"
                    >{!authLoading ? <>Enviar Email</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}</Button>
                </form>
            </div>
            <Toast className={`fixed border bottom-4 transition-opacity duration-300 ease-in-out opacity-100 ${emailInvited ? '' : 'opacity-0'}`}>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <HiPaperAirplane className="w-6 h-6 rotate-45"/>
                </div>
                <div className="ml-3 text-md font-normal">
                  Email enviado com sucesso
                </div>
                <Toast.Toggle theme={'auto'} onDismiss={() => setEmailInvited(false)}/>
            </Toast>
        </div>
    )
}