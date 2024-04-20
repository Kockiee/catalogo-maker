'use client'
import { Button, Card } from "flowbite-react"
import { useState } from "react"
import { HiArrowRight } from "react-icons/hi"
import { useAuth } from "../contexts/AuthContext"

export default function DeleteAccountButton() {
  const [showingConfirmation, setShowingConfirmation] = useState(false)
  const [error, setError] = useState("")
  const { deleteAccount } = useAuth()

  const handleDeleteAccount = async() => {
    try {
      await deleteAccount()      
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setError("Erro: Você precisa ter feito login recentemente para excluir esta conta !")
      }
    }
  }

  return (
    <>
    {showingConfirmation && (
      <div className="fixed z-50 top-0 left-0 w-full h-full flex flex-col items-center">
        <Card className="max-w-md mt-12 bg-lightcyan">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Deseja mesmo deletar sua conta ?
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Atenção !<br/>
            Sua assinatura NÃO será reembolsada.<br/>
            Você não poderá reverter essa ação após confirmar que sim.
          </p>
          <p className='text-red-600 text-sm'>{error}</p>
          <div className="flex flex-row max-sm:flex-col space-x-2 max-sm:space-x-0 max-sm:space-y-2">
          <Button onClick={handleDeleteAccount} className="!border-4 !border-jordyblue focus:!ring-0 hover:!bg-jordyblue !text-prussianblue w-full" color="">
            Sim
          </Button>
          <Button onClick={() => setShowingConfirmation(false)} className="!bg-cornflowerblue !text-lightcyan hover:!bg-jordyblue focus:!ring-cornflowerblue w-full">
            Não
            <HiArrowRight className="ml-1"/>
          </Button>
          </div>
        </Card>
      </div>
    )}
    <Button color="failure" onClick={() => setShowingConfirmation(true)}>Deletar conta</Button>
    </>
  )
}