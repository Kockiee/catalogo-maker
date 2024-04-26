'use client'
import { useAuth } from '@/app/contexts/AuthContext';
import { Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

export default function PAGE({searchParams}) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const { signUpWithEmailAndPassword, signInWithGoogle, authLoading } = useAuth()

    const signUpMiddleware = async(action) => {
      if (isTermsAccepted) {
        await action();
      } else {
        setError("Você precisa aceitar os termos de uso e a política de privacidade antes de continuar.")
      }
    } 

    const handleSubmit = (e) => {
      e.preventDefault();
      signUpMiddleware(async() => {
        if (password === repeatedPassword) {
          try {
            await signUpWithEmailAndPassword(username, email, password)
          } catch (err) {
            setError("")
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

    const handleSignWithGoogle = () => {
      signUpMiddleware(async() => {
        try {
          await signInWithGoogle()
        } catch (err) {
          if (err.code === 'auth/email-already-in-use') {
            setError(<Text className="text-base text-red-600 dark:text-red-400"><Text className="font-medium">Opa!</Text> Esse email já existe.</Text>)
          }
        }
      })
    }

    return (
        <main className="flex justify-center items-center h-full">
            <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
                <h1 className='font-bold text-xl'>Crie uma conta</h1>
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
                      setError("")
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
                      setError("")
                    }}
                    id="repeat-password" 
                    type="password"
                    placeholder="**********"
                    required 
                    shadow />
                  </div>
                  <p className='text-red-600 text-sm'>{error}</p>
                  <div className="flex items-center gap-2">
                    <Checkbox className='w-6 h-6 mr-2' onChange={(e) => setIsTermsAccepted(e.target.checked)} id="agree" required color="blue"/>
                    <Label htmlFor="agree">
                      Eu concordo com os&nbsp;
                      <Link href={searchParams.mobileMode ? "/use-terms" : "/use-terms?mobileMode=True"} className="inline-flex text-neonblue hover:underline dark:text-cyan-500">
                        termos de uso
                      </Link> e as <Link href={searchParams.mobileMode ? "/privacy-police" : "/privacy-police?mobileMode=True"} className="inline-flex text-neonblue hover:underline dark:text-cyan-500">
                        políticas de privacidade
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor='donthaveaccount' className="flex">
                      Já tem uma conta ?&nbsp;
                      <Link href={searchParams.mobileMode ? "/auth/signin" : "/auth/signin?mobileMode=True"} className="text-neonblue hover:underline dark:text-cyan-500">
                        Entrar na conta
                      </Link>
                    </Label>
                  </div>
                  <Button type="submit" className='bg-neonblue hover:!bg-neonblue/80 focus:ring-0'>
                    {!authLoading ? <>Criar Conta</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}
                  </Button>
                </form>
                <p className='text-base'>ou</p>
                <Button 
                onClick={handleSignWithGoogle}
                className='inline-flex bg-gray-100 text-black hover:!bg-gray-200 border border-gray-200 focus:ring-0'>
                  <FcGoogle className='w-8 h-8'/> Continuar com Google
                </Button>
            </div>
        </main>
    )
}