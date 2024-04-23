'use client'
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext";
import { FaFireFlameCurved } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";

export default function PlanCard({recurrenceType = 1, price = 25, disabled = false}) {
  const [paymentLink, setPaymentLink] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    async function getPaymentLink () {
      const response = await fetch("/api/payments/payment-link/create", {
        method: "POST",
        headers: {
          'Authorization': await user.getIdToken()
        },
        body: JSON.stringify({
          uid: user.uid,
          recurrenceType: recurrenceType
        })
      })
      const data = await response.json()
      setPaymentLink(data.payment_link)
    } 
    if (user && !disabled) {
      getPaymentLink()
    }
  }, [user])

  return (
    <div className={`bg-lightcyan p-4 border-4 border-jordyblue rounded-lg flex flex-col items-center space-y-1 m-2 max-sm:text-center`}>
      <div className="flex w-full justify-center">
        <div className="inline-flex items-center text-lightcyan bg-prussianblue px-3 py-1.5 rounded-full">
          {recurrenceType === 1 ? (
            <>
              <FaFireFlameCurved />
              <p className="text-base">Mais Popular</p>
            </>
          ) : recurrenceType === 2 ? (
            <>
              <MdDiscount />
              <p className="text-base">13% OFF</p>
            </>
          ) : (
            <>
              <MdDiscount />
              <p className="text-base">20% OFF</p>
            </>
          )}
        </div>
      </div>
      <h2 className="text-gray-500 text-base">Plano Premium - {recurrenceType === 1 ? "Mensal" : recurrenceType === 2 ? "Trimestral" : "Anual"}</h2>
      {recurrenceType === 1 ? (<>
        <h1 className="text-2xl font-bold text-prussianblue">7 dias grátis</h1>
        <p className="text-sm text-gray-500 pb-4">Depois, R${price} por mês</p>
      </>) : (
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold text-prussianblue">R${price}</h1>
          <p className="text-sm text-gray-500 w-16 ml-1 text-left">{recurrenceType === 2 ? "a cada 3 meses" : "por ano"}</p>
        </div>
      )}
      {disabled && (
        <Link href="/dashboard/plan" className="w-full">
          <Button
          className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue !mt-2 w-full">
            {recurrenceType === 1 ? "Iniciar avaliação" : "Assinar"}
          </Button>
        </Link>
      )}
      {paymentLink && (
        <Link href={paymentLink} className="w-full">
          <Button
          className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue !mt-2 w-full">
            {recurrenceType === 1 ? "Iniciar avaliação" : "Assinar"}
          </Button>
        </Link>
      )}
      <p className="text-xs">Formas de pagamento aceitas:</p>
      <div className="flex space-x-2">
        <img className="PaymentMethodFooter-image" role="presentation" src="https://js.stripe.com/v3/fingerprinted/img/amex-b933c9009eeaf8cfd07e789c549b8c57.svg" alt="amex"/>
        <img className="PaymentMethodFooter-image" role="presentation" src="https://js.stripe.com/v3/fingerprinted/img/mastercard-86e9a2b929496a34918767093c470935.svg" alt="mastercard"/>
        <img className="PaymentMethodFooter-image" role="presentation" src="https://js.stripe.com/v3/fingerprinted/img/visa-fb36094822f73d7bc581f6c0bad1c201.svg" alt="visa"/>
        <img className="PaymentMethodFooter-image" role="presentation" src="https://js.stripe.com/v3/fingerprinted/img/google_pay-ca6cc2f4ee364c7966f8fabf064849fe.svg" alt="google-pay"/>
      </div>
    </div>
  )
}