'use client'
import PlanCard from "@/app/components/PlanCard";
import { useAuth } from "@/app/contexts/AuthContext";
import { redirect } from "next/navigation";
import { MdVerified } from "react-icons/md";

export default function PAGE() {
  const { DBUser } = useAuth()

  var isPremiumUser = DBUser === false ? null : DBUser.premium ? true : false

  if (isPremiumUser) {
    return redirect("/dashboard")
  }

  return (
    <>
    {isPremiumUser !== null && (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">Assine um plano para começar</h1>
      <p className="text-center">
        Assinando um plano você obtém acesso total ao Catálogo Maker e nos
        ajuda a manter e aprimorar nossas tecnologias.
      </p>
      <div className="flex flex-wrap items-center justify-center w-full">
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={2} price={65}/>
        </div>
        <div className="m-3 max-w-xs w-full">
          <PlanCard/>
        </div>
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={3} price={240}/>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2>
        <ul className="block space-y-2 text-justify">
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Catálogos ilimitados
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Hospedagem gratuita no Catálogo Maker
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Catálogo com as cores do seu negócio
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            SEO otimizado para seus clientes te encontrarem facilmente
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Link compartilhável com qualquer pessoa
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Uma página exclusiva para seu catálogo
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Gerenciamento de pedidos fácil e otimizado
          </li>
          <li>
            <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
            Suporte humanizado
          </li>
        </ul>
      </div>
    </div>
    )}
    </>
  );
}