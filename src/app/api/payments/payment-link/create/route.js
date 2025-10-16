/**
 * API Route para criação de links de pagamento
 * 
 * Este arquivo gerencia a criação de links de pagamento do Stripe para
 * assinaturas de planos premium. Permite que usuários criem links de
 * pagamento para diferentes tipos de recorrência (mensal, trimestral, anual)
 * e verifica se já existe um link ativo antes de criar um novo.
 */

// Importa o middleware de verificação de token JWT para autenticação
import verifyJWTToken from '@/app/api/middlewares/verifyJWTToken';

// Configura o cliente do Stripe com a chave secreta
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

/**
 * Função principal para criação de link de pagamento
 * Método HTTP: POST
 * Autenticação: Requerida (JWT Token)
 * Parâmetros: uid (ID do usuário), recurrenceType (Tipo de recorrência)
 */
export async function POST(req) {
  // Verifica se o token JWT é válido antes de prosseguir
  return await verifyJWTToken(req, async() => {
    // Extrai os dados do corpo da requisição
    const body = await req.json()
    // Obtém o ID do usuário e o tipo de recorrência
    const { uid, recurrenceType } = body;
  
    // Verifica se os parâmetros obrigatórios foram fornecidos
    if (uid && recurrenceType && uid !== "" && recurrenceType !== "") {
      // Define o ID do preço baseado no tipo de recorrência
      const price_id = recurrenceType === 1 ? 
      process.env.STRIPE_TEST_MONTHLY_PRICE_ID      // Plano mensal
      : recurrenceType === 2 ? 
      process.env.STRIPE_TEST_QUARTERLY_PRICE_ID    // Plano trimestral
      : recurrenceType === 3 &&
      process.env.STRIPE_TEST_ANNUAL_PRICE_ID       // Plano anual
      
      // Lista todos os links de pagamento existentes
      const paymentLinks = await stripe.paymentLinks.list();
  
      // Verifica se já existe um link ativo para este usuário e tipo de recorrência
      for (let i = 0; i < paymentLinks.data.length; i++) {
        if (paymentLinks.data[i].metadata.user_id === uid && 
            paymentLinks.data[i].metadata.recurrenceType === `${recurrenceType}` && 
            paymentLinks.data[i].active) {
          // Retorna o link existente se encontrado
          return Response.json({ success: true, payment_link: paymentLinks.data[i].url }, { status: 200 });
        }
      }
  
      // Cria um novo link de pagamento com configurações específicas
      const paymentLink = await stripe.paymentLinks.create(recurrenceType === 1 ? 
      // Configuração para plano mensal (com período de teste)
      {
        line_items: [
          {
            price: price_id,    // ID do preço do plano
            quantity: 1,        // Quantidade fixa de 1
          },
        ],
        metadata: {
          user_id: uid,                    // ID do usuário para identificação
          recurrenceType: recurrenceType  // Tipo de recorrência
        },
        allow_promotion_codes: true,      // Permite códigos promocionais
        after_completion: {
          type: "redirect",               // Tipo de redirecionamento após pagamento
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment-finished`
          }
        },
        restrictions: {
          completed_sessions: {
            limit: 1                      // Limita a 1 sessão de pagamento
          }
        },
        subscription_data: {
          trial_period_days: 7            // Período de teste de 7 dias
        }
      } : 
      // Configuração para planos trimestral e anual (sem período de teste)
      {
        line_items: [
          {
            price: price_id,    // ID do preço do plano
            quantity: 1,        // Quantidade fixa de 1
          },
        ],
        metadata: {
          user_id: uid,                    // ID do usuário para identificação
          recurrenceType: recurrenceType  // Tipo de recorrência
        },
        allow_promotion_codes: true,      // Permite códigos promocionais
        after_completion: {
          type: "redirect",               // Tipo de redirecionamento após pagamento
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment-finished`
          }
        },
        restrictions: {
          completed_sessions: {
            limit: 1                      // Limita a 1 sessão de pagamento
          }
        }
      })
  
      // Retorna o novo link de pagamento criado
      return Response.json({ success: true, payment_link: paymentLink.url }, { status: 201 });
    } else {
      // Retorna erro se os parâmetros são inválidos
      return Response.json({ error: "Parâmetros inválidos fornecidos." }, { status: 400 });
    }
  })
}