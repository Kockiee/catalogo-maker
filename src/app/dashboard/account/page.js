'use client'
import DeleteAccountButton from "@/app/components/DeleteAccountButton"
import { useAuth } from "@/app/contexts/AuthContext"
import moment from "moment-timezone"
import { Button } from "flowbite-react"

export default function PAGE() {
  const { user, logout, DBUser } = useAuth()

  const handleSignOut = async() => {
    await logout();
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-xl font-bold">Olá {DBUser ? DBUser.username : "..."}</h1>
      <h2>Aqui você encontra as informações completas da sua conta.</h2>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 text-lg font-semibold">
        {DBUser && user && (
          <>
            <ul>
              <li>Nome de usuário: {user.displayName}</li>
              <li>Email verificado: {user.emailVerified ? "✅ Verificado" : " ❌ Não verificado"}</li>
              <li className="break-words">Id da conta (para suporte): {user.uid}</li>
            </ul>
            <ul>
              <li>Seu email: {user.email}</li>
              <li>Data de criação: {moment(user.metadata.creationTime).format('DD/MM/YYYY')}</li>
              <li>Plano premium: {DBUser.premium ? "👑 Ativado" : "Desativado"}</li>
            </ul>
          </>
        )}
      </div>
      <div className="flex max-sm:w-full max-sm:space-x-0 max-sm:flex-col max-sm:space-y-2 space-x-2 mt-4">
        <Button color="failure" onClick={handleSignOut}>Sair da conta</Button>
        <DeleteAccountButton/>
      </div>
    </div>
  )  
}