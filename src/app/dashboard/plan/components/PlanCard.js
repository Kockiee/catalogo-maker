/**
 * Componente de card de plano de assinatura
 * 
 * Este arquivo contém o componente que exibe um card de plano de assinatura
 * com informações sobre preço, recorrência e benefícios. Gera automaticamente
 * links de pagamento através da API e exibe diferentes tipos de planos
 * (mensal, trimestral, anual) com descontos apropriados.
 * 
 * Funcionalidades principais:
 * - Exibição de diferentes tipos de planos (mensal, trimestral, anual)
 * - Geração automática de links de pagamento
 * - Exibição de descontos e badges promocionais
 * - Suporte a diferentes formas de pagamento
 * - Estados de loading e erro
 */

'use client'
// Importa hooks do React para estado e efeitos
import { useEffect, useState } from "react";
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importa ícone de chama para planos populares
import { FaFireFlameCurved } from "react-icons/fa6";
// Importa ícone de desconto
import { MdDiscount } from "react-icons/md";
// Importa componente de botão personalizado
import ButtonAPP from "@/app/components/ButtonAPP";

// Componente principal do card de plano
export default function PlanCard({ recurrenceType = 1, price = 25, disabled = false }) {
  // Estado que armazena o link de pagamento gerado
  const [paymentLink, setPaymentLink] = useState(null);
  // Estado que indica se o link de pagamento já foi gerado
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false);
  // Extrai dados do usuário do contexto de autenticação
  const { user } = useAuth();

  // Efeito que gera o link de pagamento quando o componente é montado
  useEffect(() => {
    // Função assíncrona que gera o link de pagamento
    const getPaymentLink = async () => {
      try {
        // Obtém o token de autenticação do usuário
        const token = await user.getIdToken();
        // Faz requisição para criar link de pagamento
        const response = await fetch("/api/payments/payment-link/create", {
          method: "POST",
          headers: {
            'Authorization': token, // Token de autenticação
            'Content-Type': 'application/json', // Tipo de conteúdo
          },
          body: JSON.stringify({
            uid: user.uid, // ID do usuário
            recurrenceType: recurrenceType, // Tipo de recorrência do plano
          }),
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error('Failed to generate payment link');
        }

        // Extrai o link de pagamento da resposta
        const data = await response.json();
        setPaymentLink(data.payment_link); // Armazena o link gerado
        setPaymentLinkGenerated(true); // Marca como gerado
      } catch (error) {
        // Registra erro no console para debug
        console.error('Error generating payment link:', error);
      }
    };

    // Só gera o link se há usuário, não está desabilitado e ainda não foi gerado
    if (user && !disabled && !paymentLinkGenerated) {
      getPaymentLink();
    }
  }, [user, recurrenceType, disabled, paymentLinkGenerated]); // Executa quando essas dependências mudam

  return (
    <div className="bg-lightcyan p-4 border-4 border-jordyblue rounded-lg flex flex-col items-center space-y-1 m-2 max-sm:text-center">
      {/* Badge promocional no topo do card */}
      <div className="flex w-full justify-center">
        <div className="inline-flex items-center text-lightcyan bg-prussianblue px-3 py-1.5 rounded-full">
          {/* Badge para plano mensal (mais popular) */}
          {recurrenceType === 1 ? (
            <>
              <FaFireFlameCurved />
              <p className="text-base">Mais Popular</p>
            </>
          ) : recurrenceType === 2 ? (
            /* Badge para plano trimestral (13% OFF) */
            <>
              <MdDiscount />
              <p className="text-base">13% OFF</p>
            </>
          ) : (
            /* Badge para plano anual (20% OFF) */
            <>
              <MdDiscount />
              <p className="text-base">20% OFF</p>
            </>
          )}
        </div>
      </div>
      {/* Título do plano com tipo de recorrência */}
      <h2 className="text-gray-500 text-base">Plano Premium - {recurrenceType === 1 ? "Mensal" : recurrenceType === 2 ? "Trimestral" : "Anual"}</h2>
      {/* Preço e período do plano */}
      {recurrenceType === 1 ? (
        /* Plano mensal com período de teste gratuito */
        <>
          <h1 className="text-2xl font-bold text-prussianblue">7 dias grátis</h1>
          <p className="text-sm text-gray-500 pb-4">Depois, R${price} por mês</p>
        </>
      ) : (
        /* Planos trimestral e anual com preço fixo */
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold text-prussianblue">R${price}</h1>
          <p className="text-sm text-gray-500 w-16 ml-1 text-left">{recurrenceType === 2 ? "a cada 3 meses" : "por ano"}</p>
        </div>
      )}
      {/* Botão de assinatura com link de pagamento */}
      {paymentLink && (
        <ButtonAPP href={paymentLink} className="w-full">
          {recurrenceType === 1 ? "Iniciar avaliação" : "Assinar"}
        </ButtonAPP>
      )}
      {/* Botão de fallback quando não há link de pagamento */}
      {!paymentLink && disabled && (
        <ButtonAPP href="/dashboard/plan" className="w-full">
          {recurrenceType === 1 ? "Iniciar avaliação" : "Assinar"}
        </ButtonAPP>
      )}
      {/* Texto informativo sobre formas de pagamento */}
      <p className="text-xs">Formas de pagamento aceitas:</p>
      {/* Ícones das formas de pagamento aceitas */}
      <div className="flex space-x-2">
        {/* Ícone do American Express */}
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/amex-b933c9009eeaf8cfd07e789c549b8c57.svg"
          alt="American Express"
        />
        {/* Ícone do MasterCard */}
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/mastercard-86e9a2b929496a34918767093c470935.svg"
          alt="MasterCard"
        />
        {/* Ícone do Visa */}
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/visa-fb36094822f73d7bc581f6c0bad1c201.svg"
          alt="Visa"
        />
        {/* Ícone do Google Pay */}
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/google_pay-ca6cc2f4ee364c7966f8fabf064849fe.svg"
          alt="Google Pay"
        />
      </div>
    </div>
  );
}
