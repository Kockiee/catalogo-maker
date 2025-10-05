/**
 * Página de informações da conta do usuário
 * 
 * Este arquivo contém a página onde o usuário pode visualizar
 * todas as informações da sua conta, incluindo dados pessoais,
 * status de verificação, plano premium e opções de gerenciamento
 * da conta como logout e exclusão.
 * 
 * Funcionalidades principais:
 * - Exibição de informações pessoais do usuário
 * - Status de verificação de email
 * - Status do plano premium
 * - Botões para copiar informações importantes
 * - Opções de logout e exclusão da conta
 */

'use client'
// Importa componente para excluir conta
import DeleteAccountButton from "@/app/dashboard/account/components/DeleteAccountButton"
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext"
// Importa biblioteca para formatação de datas
import moment from "moment-timezone"
// Importa componente Button do Flowbite
import { Button } from "flowbite-react"
// Importa componente para copiar informações
import CopyButton from "@/app/dashboard/account/components/CopyButton"

// Componente principal da página de conta
export default function PAGE() {
  // Extrai dados do usuário e funções do contexto de autenticação
  const { user, logout, DBUser } = useAuth()

  // Função que executa o logout do usuário
  const handleSignOut = async() => {
    await logout(); // Chama a função de logout do contexto
  };

  return (
    <div className="flex flex-col justify-center">
      {/* Saudação personalizada com nome do usuário */}
      <h1 className="text-xl font-bold">Olá {DBUser ? DBUser.username : "..."}</h1>
      <h2>Aqui você encontra as informações completas da sua conta.</h2>
      {/* Grid responsivo com informações da conta */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 text-lg font-semibold">
        {DBUser && user && (
          <>
            {/* Primeira coluna de informações */}
            <ul>
              {/* Nome de usuário com botão para copiar */}
              <li className="py-2 flex flex-row items-center"><p>Nome de usuário: {user.displayName}</p> <CopyButton toCopy={user.displayName} successMessage="Informação copiada !"/></li>
              {/* Status de verificação de email */}
              <li className="py-2">Email verificado: {user.emailVerified ? "✅ Verificado" : " ❌ Não verificado"}</li>
              {/* ID da conta com botão para copiar */}
              <li className="break-words py-2 flex flex-row items-center">Id da conta (para suporte): <span className="break-all contents ">{user.uid}</span> <CopyButton toCopy={user.uid} successMessage="Informação copiada !"/></li>
            </ul>
            {/* Segunda coluna de informações */}
            <ul>
              {/* Email do usuário com botão para copiar */}
              <li className="py-2 flex flex-row items-center">Seu email: {user.email} <CopyButton toCopy={user.email} successMessage="Informação copiada !"/></li>
              {/* Data de criação da conta formatada */}
              <li className="py-2">Data de criação: {moment(user.metadata.creationTime).format('DD/MM/YYYY')}</li>
              {/* Status do plano premium */}
              <li className="py-2">Plano premium: {DBUser.premium ? "👑 Ativado" : "Desativado"}</li>
            </ul>
          </>
        )}
      </div>
      {/* Botões de ação da conta */}
      <div className="flex max-sm:w-full max-sm:space-x-0 max-sm:flex-col max-sm:space-y-2 space-x-2 mt-4">
        {/* Botão para sair da conta */}
        <Button color="failure" className="duration-200" onClick={handleSignOut}>Sair da conta</Button>
        {/* Botão para excluir a conta */}
        <DeleteAccountButton/>
      </div>
    </div>
  )  
}