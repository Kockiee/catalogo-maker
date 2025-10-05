/**
 * Componente de botão para excluir conta do usuário
 * 
 * Este arquivo contém um componente que permite ao usuário
 * excluir sua conta permanentemente. Inclui modal de confirmação,
 * validação de segurança e tratamento de erros.
 * 
 * Funcionalidades principais:
 * - Modal de confirmação de exclusão
 * - Validação de segurança
 * - Tratamento de erros específicos
 * - Notificações de feedback
 * - Interface de confirmação
 */

'use client'
// Importa componentes do Flowbite
import { Button, Card } from "flowbite-react"
// Importa hook useState do React
import { useState } from "react"
// Importa ícone de seta para direita
import { HiArrowRight } from "react-icons/hi"
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext"
// Importa componente de card de erro
import ErrorCard from "@/app/auth/components/ErrorCard"
// Importa hook de notificações
import { useNotifications } from "../../../hooks/useNotifications"

// Componente principal do botão de excluir conta
export default function DeleteAccountButton() {
  // Estado que controla se o modal de confirmação está visível
  const [showingConfirmation, setShowingConfirmation] = useState(false)
  // Estado para mensagens de erro
  const [error, setError] = useState("")
  // Estado de loading durante exclusão
  const [loading, setLoading] = useState(false)
  // Extrai função de exclusão de conta do contexto de autenticação
  const { deleteAccount } = useAuth()
  // Hook para exibir notificações ao usuário
  const { notify } = useNotifications()

  // Função que executa a exclusão da conta
  const handleDeleteAccount = async() => {
    setLoading(true) // Marca como carregando
    notify.processing("Excluindo conta...") // Mostra notificação de processamento
    
    try {
      await deleteAccount() // Executa exclusão da conta
      notify.accountDeleted() // Notifica sucesso
    } catch (err) {
      setLoading(false) // Para loading
      if (err.code === "auth/requires-recent-login") {
        setError("Erro: Você precisa ter feito login recentemente para excluir esta conta !") // Erro de autenticação recente
      } else {
        notify.accountDeletionFailed() // Notifica falha genérica
      }
    }
  }

  return (
    <>
    {/* Modal de confirmação de exclusão */}
    {showingConfirmation && (
      <div className="fixed z-50 top-0 left-0 w-full h-full flex flex-col items-center">
        <Card className="max-w-md mt-12 bg-lightcyan">
          {/* Título do modal */}
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Deseja mesmo deletar sua conta ?
          </h5>
          {/* Avisos importantes */}
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Atenção !<br/>
            Sua assinatura NÃO será reembolsada.<br/>
            Você não poderá reverter essa ação após confirmar que sim.
          </p>
          {/* Card de erro se houver */}
          <ErrorCard error={error}/>
          {/* Botões de ação */}
          <div className="flex flex-row max-sm:flex-col space-x-2 max-sm:space-x-0 max-sm:space-y-2">
          <Button 
            onClick={handleDeleteAccount} 
            disabled={loading}
            className="duration-200 !border-4 !border-jordyblue focus:!ring-0 hover:!bg-jordyblue !text-prussianblue w-full" 
            color=""
          >
            {loading ? "Excluindo..." : "Sim"}
          </Button>
          <Button onClick={() => setShowingConfirmation(false)} className="duration-200 !bg-cornflowerblue !text-lightcyan hover:!bg-jordyblue focus:!ring-cornflowerblue w-full">
            Não
            <HiArrowRight className="ml-1"/>
          </Button>
          </div>
        </Card>
      </div>
    )}
    {/* Botão principal para abrir modal de confirmação */}
    <Button className="duration-200" color="failure" onClick={() => setShowingConfirmation(true)}>Deletar conta</Button>
    </>
  )
}