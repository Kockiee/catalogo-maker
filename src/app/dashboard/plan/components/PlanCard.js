'use client'
// Importação de hooks do React
import { useEffect, useState } from "react";
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importação de ícones
import { FaFireFlameCurved } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
// Importação do componente ButtonAPP personalizado
import ButtonAPP from "@/app/components/ButtonAPP";

/**
 * Componente de card para exibir informações de um plano de assinatura
 * Gera link de pagamento dinamicamente e exibe detalhes do plano
 * @param {number} recurrenceType - Tipo de recorrência (1=mensal, 2=semestral, 3=anual)
 * @param {number} price - Preço do plano em reais
 * @param {boolean} disabled - Se o card está desabilitado
 * @returns {JSX.Element} Card do plano com informações e botão de compra
 */
export default function PlanCard({ recurrenceType = 1, price = 25, disabled = false }) {
  // Estados para controlar o link de pagamento
  const [paymentLink, setPaymentLink] = useState(null);           // URL do link de pagamento
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false); // Flag de geração
  // Desestruturação dos dados do contexto de autenticação
  const { user } = useAuth();

  /**
   * Efeito para gerar o link de pagamento quando o componente é montado
   * Só executa se houver usuário, não estiver desabilitado e link ainda não foi gerado
   */
  useEffect(() => {
    /**
     * Função assíncrona para obter o link de pagamento do servidor
     * Chama a API de pagamentos com token de autenticação
     */
    const getPaymentLink = async () => {
      try {
        // Obtém o token de autenticação do usuário
        const token = await user.getIdToken();
        // Faz requisição para API de criação de link de pagamento
        const response = await fetch("/api/payments/payment-link/create", {
          method: "POST",
          headers: {
            'Authorization': token,                    // Token para autenticação
            'Content-Type': 'application/json',        // Tipo de conteúdo
          },
          body: JSON.stringify({
            uid: user.uid,                            // ID do usuário
            recurrenceType: recurrenceType,           // Tipo de recorrência
          }),
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error('Failed to generate payment link');
        }

        // Converte resposta para JSON
        const data = await response.json();
        // Atualiza estado com o link de pagamento
        setPaymentLink(data.payment_link);
        // Marca que o link foi gerado
        setPaymentLinkGenerated(true);
      } catch (error) {
        // Trata erros na geração do link
        console.error('Error generating payment link:', error);
      }
    };

    // Só executa se tiver usuário, não estiver desabilitado e link não foi gerado
    if (user && !disabled && !paymentLinkGenerated) {
      getPaymentLink();  // Inicia geração do link
    }
  }, [user, recurrenceType, disabled, paymentLinkGenerated]);  // Dependências do efeito

  return (
    <div className="bg-lightcyan p-4 border-4 border-jordyblue rounded-lg flex flex-col items-center space-y-1 m-2 max-sm:text-center">
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
      {recurrenceType === 1 ? (
        <>
          <h1 className="text-2xl font-bold text-prussianblue">7 dias grátis</h1>
          <p className="text-sm text-gray-500 pb-4">Depois, R${price} por mês</p>
        </>
      ) : (
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold text-prussianblue">R${price}</h1>
          <p className="text-sm text-gray-500 w-16 ml-1 text-left">{recurrenceType === 2 ? "a cada 3 meses" : "por ano"}</p>
        </div>
      )}
      {paymentLink && (
        <ButtonAPP href={paymentLink} className="w-full">
          {recurrenceType === 1 ? "Iniciar avaliação" : "Assinar"}
        </ButtonAPP>
      )}
      {!paymentLink && disabled && (
        <ButtonAPP href="/dashboard/plan" className="w-full">
          {recurrenceType === 1 ? "Iniciar avaliação" : "Assinar"}
        </ButtonAPP>
      )}
      <p className="text-xs">Formas de pagamento aceitas:</p>
      <div className="flex space-x-2">
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/amex-b933c9009eeaf8cfd07e789c549b8c57.svg"
          alt="American Express"
        />
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/mastercard-86e9a2b929496a34918767093c470935.svg"
          alt="MasterCard"
        />
        <img
          className="w-6 h-6"
          role="presentation"
          src="https://js.stripe.com/v3/fingerprinted/img/visa-fb36094822f73d7bc581f6c0bad1c201.svg"
          alt="Visa"
        />
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
