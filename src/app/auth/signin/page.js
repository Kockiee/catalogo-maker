'use client'

import ErrorCard from '@/app/components/ErrorCard';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

export default function PAGE({searchParams}) {
  const mobileMode = searchParams.mobileMode;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signInWithGoogle, loginWithEmailAndPassword, authLoading } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await loginWithEmailAndPassword(email, password)
    } catch (err) {
      if (err.code == 'auth/user-not-found') {
        setError("Não encontramos sua conta.")
      } else if (err.code == 'auth/invalid-email') {
        setError("O email digitado é inválido.")
      } else if (err.code == 'auth/wrong-password') {
        setError("Sua senha está errada.")
      } else if (err.code == 'auth/too-many-requests') {
        setError("Muitas tentativas! Tente novamente mais tarde ou mude a sua senha.")
      } else if (err.code == 'auth/invalid-credential') {
        setError("As credenciais fornecidas são inválidas.")
      }
    }
  }

  const handleSignWithGoogle = async() => {
    try {
      await signInWithGoogle()
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError(<Text className="text-base text-red-600 dark:text-red-400"><Text className="font-medium">Opa!</Text> Esse email já existe.</Text>)
      }
    }
  }

  return (
    <main className="flex justify-center items-center h-full">
      <div className="rounded-lg max-w-md w-full flex flex-col items-center space-y-2 bg-white !border-4 !border-lightcyan p-4">
        <h1 className='font-bold text-xl'>Entre em sua conta</h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
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
          <ErrorCard error={error}/>
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Não tem uma conta ?&nbsp;
              <Link href={`/auth/signup${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                Criar uma conta
              </Link>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Esqueceu a senha ?&nbsp;
              <Link href={`/auth/signin/forgot-password${mobileMode ? "?mobileMode=True" : ""}`} className="text-neonblue hover:underline dark:text-cyan-500">
                Redefinir agora
              </Link>
            </Label>
          </div>
          <Button type="submit" className='bg-neonblue hover:!bg-neonblue/80 focus:ring-0'>
            {!authLoading ? <>Entrar na conta</> : <Spinner className="text-lightcyan" size={'md'}></Spinner>}
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