'use client'
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Spinner, Toast } from "flowbite-react";
import { HiPaperAirplane } from "react-icons/hi";
import ErrorCard from "@/app/components/ErrorCard";

export default function PAGE() {
    const [emailInvited, setEmailInvited] = useState(false)
    const [error, setError] = useState("")
    const { signUpEmailVerification, authLoading, user } = useAuth()

    const handleVerifyEmail = async() => {
      try {
        await signUpEmailVerification()
        setEmailInvited(true)
      } catch (err) {
        setError("")
        if (err.code === 'auth/invalid-email') {
            setError("O email digitado é inválido.")
        } else if (err.code === 'auth/too-many-requests') {
            setError("O email já deve estar na sua caixa de entrada, caso não esteja aguarde um pouco e envie de novo.")
        }
      }
    }
    
    return (
      <div className="w-full flex justify-center">
        <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
          <h1 className="text-xl font-bold">Verifique seu Email</h1>
          <p>Para sua segurança é necessário fazer uma breve verificação de email. Enviaremos um link para seu email ({user && user.email}) assim que você clicar no botão abaixo.</p>
          <Button onClick={handleVerifyEmail} className="w-full !bg-neonblue hover:!bg-neonblue/80 enabled:focus:ring-4 enabled:focus:outline-none enabled:focus:!ring-jordyblue">
            {!authLoading ? <>Enviar Email</> : <Spinner color={'warning'} size={'md'}></Spinner>}
          </Button>
          <ErrorCard error={error}/>
        </div>
        <Toast className={`fixed border bottom-24 transition-opacity duration-300 ease-in-out opacity-100 ${emailInvited ? '' : 'opacity-0'}`}>
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