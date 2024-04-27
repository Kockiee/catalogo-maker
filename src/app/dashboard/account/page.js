'use client'
import DeleteAccountButton from "@/app/components/DeleteAccountButton"
import { useAuth } from "@/app/contexts/AuthContext"
import moment from "moment-timezone"
import { Button } from "flowbite-react"
import CopyButton from "@/app/components/CopyButton"

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
              <li className="py-2 flex flex-row items-center"><p>Nome de usuário: {user.displayName}</p> <CopyButton toCopy={user.displayName} successMessage="Informação copiada !"/></li>
              <li className="py-2">Email verificado: {user.emailVerified ? "✅ Verificado" : " ❌ Não verificado"}</li>
              <li className="break-words py-2 flex flex-row items-center">Id da conta (para suporte): <span className="break-all contents ">{user.uid}</span> <CopyButton toCopy={user.uid} successMessage="Informação copiada !"/></li>
            </ul>
            <ul>
              <li className="py-2 flex flex-row items-center">Seu email: {user.email} <CopyButton toCopy={user.email} successMessage="Informação copiada !"/></li>
              <li className="py-2">Data de criação: {moment(user.metadata.creationTime).format('DD/MM/YYYY')}</li>
              <li className="py-2">Plano premium: {DBUser.premium ? "👑 Ativado" : "Desativado"}</li>
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