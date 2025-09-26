'use client'
// Importação de componentes do Flowbite React
import { Button, Card } from "flowbite-react"
// Importação do hook useState do React
import { useState } from "react"
// Importação do ícone de seta direita
import { HiArrowRight } from "react-icons/hi"
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext"
// Importação do componente de erro
import ErrorCard from "@/app/auth/components/ErrorCard"
// Importação do hook personalizado para notificações
import { useNotifications } from "../../../hooks/useNotifications"

/**
 * Componente de botão para deletar conta do usuário
 * Exibe modal de confirmação antes de executar a exclusão
 * Trata erros de autenticação e permissões
 * @returns {JSX.Element} Botão com modal de confirmação
 */
export default function DeleteAccountButton() {
  // Estados para controlar o modal e processo de exclusão
  const [showingConfirmation, setShowingConfirmation] = useState(false) // Controla exibição do modal
  const [error, setError] = useState("")                               // Mensagens de erro
  const [loading, setLoading] = useState(false)                        // Estado de carregamento
  // Desestruturação das funções do contexto de autenticação
  const { deleteAccount } = useAuth()
  // Desestruturação da função de notificação
  const { notify } = useNotifications()

  /**
   * Função assíncrona para lidar com a exclusão da conta
   * Executa verificações de segurança e trata diferentes tipos de erro
   */
  const handleDeleteAccount = async() => {
    setLoading(true)                           // Ativa estado de carregamento
    notify.processing("Excluindo conta...")   // Exibe notificação de processamento

    try {
      // Tenta executar a exclusão da conta
      await deleteAccount()
      // Exibe notificação de sucesso (não será vista pois usuário será deslogado)
      notify.accountDeleted()
    } catch (err) {
      setLoading(false)  // Desativa estado de carregamento em caso de erro
      // Trata erro específico de login recente obrigatório
      if (err.code === "auth/requires-recent-login") {
        setError("Erro: Você precisa ter feito login recentemente para excluir esta conta !")
      } else {
        // Trata outros erros genéricos
        notify.accountDeletionFailed()
      }
    }
  }

  // Renderiza o botão e modal de confirmação de exclusão
  return (
    <>
    {/* Modal de confirmação - só aparece quando showingConfirmation for true */}
    {showingConfirmation && (
      <div className="fixed z-50 top-0 left-0 w-full h-full flex flex-col items-center">
        {/* Card com aviso de confirmação */}
        <Card className="max-w-md mt-12 bg-lightcyan">
          {/* Título do modal de confirmação */}
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Deseja mesmo deletar sua conta ?
          </h5>
          {/* Texto de aviso sobre consequências */}
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Atenção !<br/>
            Sua assinatura NÃO será reembolsada.<br/>
            Você não poderá reverter essa ação após confirmar que sim.
          </p>
          {/* Componente para exibir erros */}
          <ErrorCard error={error}/>
          {/* Container dos botões de ação */}
          <div className="flex flex-row max-sm:flex-col space-x-2 max-sm:space-x-0 max-sm:space-y-2">
            {/* Botão de confirmação de exclusão */}
            <Button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="duration-200 !border-4 !border-jordyblue focus:!ring-0 hover:!bg-jordyblue !text-prussianblue w-full"
              color=""
            >
              {loading ? "Excluindo..." : "Sim"}  {/* Texto dinâmico baseado no estado */}
            </Button>
            {/* Botão para cancelar exclusão */}
            <Button
              onClick={() => setShowingConfirmation(false)}
              className="duration-200 !bg-cornflowerblue !text-lightcyan hover:!bg-jordyblue focus:!ring-cornflowerblue w-full"
            >
              Não  {/* Texto do botão de cancelar */}
              <HiArrowRight className="ml-1"/>  {/* Ícone de seta */}
            </Button>
          </div>
        </Card>
      </div>
    )}
    {/* Botão principal para iniciar o processo de exclusão */}
    <Button className="duration-200" color="failure" onClick={() => setShowingConfirmation(true)}>
      Deletar conta
    </Button>
    </>
  )
}