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
    <div className="flex flex-col justify-center bg-lightcyan p-6 rounded-lg shadow-md">
      {/* Saudação personalizada com nome do usuário */}
      <h1 className="text-2xl font-bold text-prussianblue mb-2">Olá {DBUser ? DBUser.username : "..."}</h1>
      <h2 className="text-lg text-gray-700 mb-6">Aqui você encontra as informações completas da sua conta.</h2>

      {/* Grid responsivo com informações da conta */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 text-lg font-semibold">
        {DBUser && user && (
          <>
            {/* Primeira coluna de informações */}
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <p className="text-gray-800">Nome de usuário: {user.displayName}</p>
                <CopyButton toCopy={user.displayName} successMessage="Nome de usuário copiado!" />
              </li>
              <li className="flex justify-between items-center">
                <p className="text-gray-800">Id da conta (para suporte): {user.uid}</p>
                <CopyButton toCopy={user.uid} successMessage="ID copiado!" />
              </li>
              <li className="flex justify-between items-center">
                <p className="text-gray-800">Seu email: {user.email}</p>
                <CopyButton toCopy={user.email} successMessage="Email copiado!" />
              </li>
            </ul>

            {/* Segunda coluna de informações */}
            <ul className="space-y-4">
              <li className="text-gray-800">Email verificado: {user.emailVerified ? "✅ Verificado" : "❌ Não verificado"}</li>
              <li className="text-gray-800">Data de criação: {moment(user.metadata.creationTime).format('DD/MM/YYYY')}</li>
              <li className="text-gray-800">Plano premium: {DBUser.premium ? "👑 Ativado" : "Desativado"}</li>
            </ul>
          </>
        )}
      </div>

      {/* Botões de ação da conta */}
      <div className="flex flex-wrap gap-4 mt-6">
        {/* Botão para sair da conta */}
        <Button color="failure" className="duration-200 hover:bg-red-600" onClick={handleSignOut}>Sair da conta</Button>
        {/* Botão para excluir a conta */}
        <DeleteAccountButton />
      </div>
    </div>
  )  
}