'use client'
// Importação do hook useEffect do React
import { useEffect } from "react";
// Importação do componente de card de plano
import PlanCard from "@/app/dashboard/plan/components/PlanCard";
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importação do hook useRouter do Next.js
import { useRouter } from "next/navigation";
// Importação do ícone de verificação
import { MdVerified } from "react-icons/md";

/**
 * Página de planos e assinatura
 * Exibe opções de planos disponíveis e benefícios do premium
 * Redireciona usuários premium automaticamente para o dashboard
 * @returns {JSX.Element} Interface de seleção de planos
 */
export default function PAGE() {
  // Desestruturação dos dados do contexto de autenticação
  const { DBUser } = useAuth();
  // Hook para navegação programática
  const router = useRouter();

  // Determina se o usuário é premium (null se dados ainda não carregaram)
  const isPremiumUser = DBUser?.premium ?? null;

  /**
   * Efeito para redirecionamento automático de usuários premium
   * Usuários que já têm assinatura premium são redirecionados para o dashboard
   */
  useEffect(() => {
    if (isPremiumUser) {
      router.push("/dashboard"); // Redireciona para dashboard principal
    }
  }, [isPremiumUser, router]);  // Dependências: executa quando status premium muda

  /**
   * Renderização condicional baseada no status premium
   * Retorna null para usuários premium (serão redirecionados)
   */
  if (isPremiumUser) {
    return null; // Evita renderização desnecessária durante redirecionamento
  }

  // Renderiza a interface da página de planos
  return (
    <div className="flex flex-col items-center">
      {/* Título principal da página */}
      <h1 className="text-4xl font-bold text-center">Assine um plano para começar</h1>

      {/* Descrição explicativa */}
      <p className="text-center">
        Assinando um plano você obtém acesso total ao Catálogo Maker e nos ajuda a manter e aprimorar nossas tecnologias.
      </p>

      {/* Aviso sobre aumento de preços */}
      <div className="bg-green-400 rounded-full py-2 px-4 mt-4 text-white">
        <p>Atenção! Os preços dos planos serão aumentados em {process.env.NEXT_PUBLIC_NEXT_PRICE_ALTERATION_DAY}</p>
      </div>

      {/* Container dos cards de planos */}
      <div className="flex flex-wrap items-center justify-center w-full">
        {/* Plano semestral */}
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={2} price={65} />  {/* recurrenceType 2 = semestral */}
        </div>
        {/* Plano mensal (padrão) */}
        <div className="m-3 max-w-xs w-full">
          <PlanCard />  {/* recurrenceType padrão = mensal */}
        </div>
        {/* Plano anual */}
        <div className="m-3 max-w-xs w-full">
          <PlanCard recurrenceType={3} price={240} />  {/* recurrenceType 3 = anual */}
        </div>
      </div>

      {/* Seção de benefícios do plano premium */}
      <div className="flex flex-col items-center">
        {/* Título da seção de benefícios */}
        <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2>

        {/* Lista de benefícios */}
        <ul className="block space-y-2 text-justify">
          {[
            "Catálogos ilimitados",                                    // Sem limite de catálogos
            "Hospedagem gratuita no Catálogo Maker",                   // Hosting incluso
            "Catálogo com as cores do seu negócio",                    // Personalização visual
            "SEO otimizado para seus clientes te encontrarem facilmente", // Otimização para mecanismos de busca
            "Link compartilhável com qualquer pessoa",                 // URL pública para compartilhar
            "Uma página exclusiva para seu catálogo",                  // Página dedicada
            "Gerenciamento de pedidos fácil e otimizado",              // Interface de pedidos
            "Suporte humanizado",                                      // Suporte personalizado
          ].map((beneficio, index) => (
            <li key={index}>
              {/* Ícone de verificação verde para cada benefício */}
              <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex" />
              {beneficio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}