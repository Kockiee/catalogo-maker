/**
 * Página de planos e assinatura
 * 
 * Este arquivo contém a página onde usuários não premium podem
 * visualizar e escolher entre diferentes planos de assinatura.
 * Exibe os benefícios do plano premium e opções de pagamento.
 * 
 * Funcionalidades principais:
 * - Exibição de diferentes planos de assinatura
 * - Lista de benefícios do plano premium
 * - Redirecionamento automático para usuários premium
 * - Interface responsiva para seleção de planos
 */

'use client'
// Importa hook useEffect do React
import { useEffect } from "react";
// Importa componente de card de plano
import PlanCard from "@/app/dashboard/plan/components/PlanCard";
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importa hook de navegação do Next.js
import { useRouter } from "next/navigation";
// Importa ícone de verificação
import { MdVerified } from "react-icons/md";

// Componente principal da página de planos
export default function PAGE() {
  // Extrai dados do usuário do contexto de autenticação
  const { DBUser } = useAuth();
  // Hook para navegação programática
  const router = useRouter();

  // Verifica se o usuário é premium
  const isPremiumUser = DBUser?.premium ?? null;

  // Efeito que redireciona usuários premium para o dashboard
  useEffect(() => {
    if (isPremiumUser) {
      router.push("/dashboard"); // Redireciona para o dashboard se já é premium
    }
  }, [isPremiumUser, router]); // Executa quando isPremiumUser ou router mudam

  // Se o usuário é premium, não renderiza nada (está sendo redirecionado)
  if (isPremiumUser) {
    return null; // Retorna null para evitar renderização enquanto redireciona
  }

  return (
    <div className="flex flex-col items-center">
      {/* Título principal da página */}
      <h1 className="text-4xl font-bold text-center">Assine um plano para começar</h1>
      {/* Descrição dos benefícios da assinatura */}
      <p className="text-center">
        Assinando um plano você obtém acesso total ao Catálogo Maker e nos ajuda a manter e aprimorar nossas tecnologias.
      </p>
      {/* Aviso sobre alteração de preços */}
      <div className="bg-green-400 rounded-full py-2 px-4 mt-4 text-white">
        <p>Atenção! Os preços dos planos serão aumentados em {process.env.NEXT_PUBLIC_NEXT_PRICE_ALTERATION_DAY}</p>
      </div>
      {/* Container com os cards de planos */}
      <div className="flex flex-wrap items-center justify-center w-full">
        {/* Plano mensal */}
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={2} price={65} />
        </div>
        {/* Plano padrão (anual) */}
        <div className="m-3 max-w-xs w-full">
          <PlanCard />
        </div>
        {/* Plano trimestral */}
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={3} price={240} />
        </div>
      </div>
      {/* Seção de benefícios do plano premium */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2>
        {/* Lista de benefícios com ícones de verificação */}
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
              {/* Ícone de verificação verde */}
              <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex" />
              {beneficio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}