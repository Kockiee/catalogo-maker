'use client'
import { useEffect } from "react";
import PlanCard from "@/app/dashboard/plan/components/PlanCard";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MdVerified } from "react-icons/md";

export default function PAGE() {
  const { DBUser } = useAuth();
  const router = useRouter();

  const isPremiumUser = DBUser?.premium ?? null;

  useEffect(() => {
    if (isPremiumUser) {
      router.push("/dashboard"); // Correção: usar router.push()
    }
  }, [isPremiumUser, router]);

  if (isPremiumUser) {
    return null; // Retorna null para evitar renderização enquanto redireciona
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">Assine um plano para começar</h1>
      <p className="text-center">
        Assinando um plano você obtém acesso total ao Catálogo Maker e nos ajuda a manter e aprimorar nossas tecnologias.
      </p>
      <div className="bg-green-400 rounded-full py-2 px-4 mt-4 text-white">
        <p>Atenção! Os preços dos planos serão aumentados em {process.env.NEXT_PUBLIC_NEXT_PRICE_ALTERATION_DAY}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center w-full">
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={2} price={65} />
        </div>
        <div className="m-3 max-w-xs w-full">
          <PlanCard />
        </div>
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={3} price={240} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2>
        <ul className="block space-y-2 text-justify">
          {[
            "Catálogos ilimitados",
            "Hospedagem gratuita no Catálogo Maker",
            "Catálogo com as cores do seu negócio",
            "SEO otimizado para seus clientes te encontrarem facilmente",
            "Link compartilhável com qualquer pessoa",
            "Uma página exclusiva para seu catálogo",
            "Gerenciamento de pedidos fácil e otimizado",
            "Suporte humanizado",
          ].map((beneficio, index) => (
            <li key={index}>
              <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex" />
              {beneficio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}