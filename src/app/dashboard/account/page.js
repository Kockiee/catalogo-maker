'use client'
// Importação do componente para deletar conta
import DeleteAccountButton from "@/app/dashboard/account/components/DeleteAccountButton"
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext"
// Importação da biblioteca moment para formatação de datas
import moment from "moment-timezone"
// Importação do componente Button do Flowbite React
import { Button } from "flowbite-react"
// Importação do componente para copiar informações
import CopyButton from "@/app/dashboard/account/components/CopyButton"

/**
 * Página de configurações da conta do usuário
 * Exibe informações pessoais, status da conta e opções de gerenciamento
 * @returns {JSX.Element} Interface da página de conta
 */
export default function PAGE() {
  // Desestruturação dos dados e funções do contexto de autenticação
  const { user, logout, DBUser } = useAuth()

  /**
   * Função para lidar com o logout do usuário
   * Executa a função de logout do contexto de autenticação
   */
  const handleSignOut = async() => {
    await logout();  // Chama a função de logout
  };

  // Renderiza a interface da página de conta
  return (
    <div className="flex flex-col justify-center">
      {/* Título de boas-vindas com nome do usuário */}
      <h1 className="text-xl font-bold">Olá {DBUser ? DBUser.username : "..."}</h1>
      {/* Subtítulo explicativo */}
      <h2>Aqui você encontra as informações completas da sua conta.</h2>

      {/* Grid responsivo com informações da conta */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 text-lg font-semibold">
        {/* Só renderiza as informações se os dados estiverem carregados */}
        {DBUser && user && (
          <>
            {/* Lista de informações pessoais */}
            <ul>
              {/* Nome de usuário com botão de copiar */}
              <li className="py-2 flex flex-row items-center">
                <p>Nome de usuário: {user.displayName}</p>
                <CopyButton toCopy={user.displayName} successMessage="Informação copiada !"/>
              </li>
              {/* Status de verificação do email */}
              <li className="py-2">
                Email verificado: {user.emailVerified ? "✅ Verificado" : " ❌ Não verificado"}
              </li>
              {/* ID da conta com botão de copiar (para suporte) */}
              <li className="break-words py-2 flex flex-row items-center">
                Id da conta (para suporte): <span className="break-all contents ">{user.uid}</span>
                <CopyButton toCopy={user.uid} successMessage="Informação copiada !"/>
              </li>
            </ul>

            {/* Lista de informações da conta */}
            <ul>
              {/* Email com botão de copiar */}
              <li className="py-2 flex flex-row items-center">
                Seu email: {user.email}
                <CopyButton toCopy={user.email} successMessage="Informação copiada !"/>
              </li>
              {/* Data de criação da conta formatada */}
              <li className="py-2">
                Data de criação: {moment(user.metadata.creationTime).format('DD/MM/YYYY')}
              </li>
              {/* Status do plano premium */}
              <li className="py-2">
                Plano premium: {DBUser.premium ? "👑 Ativado" : "Desativado"}
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Container dos botões de ação */}
      <div className="flex max-sm:w-full max-sm:space-x-0 max-sm:flex-col max-sm:space-y-2 space-x-2 mt-4">
        {/* Botão de sair da conta */}
        <Button color="failure" className="duration-200" onClick={handleSignOut}>
          Sair da conta
        </Button>
        {/* Botão para deletar conta */}
        <DeleteAccountButton/>
      </div>
    </div>
  )  
}