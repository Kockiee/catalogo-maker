// Importa o middleware responsável por validar o token JWT.
// Isso garante que apenas usuários autenticados consigam acessar este endpoint.
import verifyJWTToken from '@/app/api/middlewares/verifyJWTToken';

// Inicializa a biblioteca Stripe com a chave secreta armazenada em variáveis de ambiente.
// A chave STRIPE_SECRET_KEY deve ser mantida segura e nunca exposta no front-end.
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

// Função que trata requisições POST para esta rota.
export async function POST(req) {
  // Primeiro valida o token JWT antes de executar a lógica da rota.
  return await verifyJWTToken(req, async() => {
    // Lê o corpo da requisição e converte para JSON.
    const body = await req.json();

    // Extrai os parâmetros esperados: uid (identificador do usuário)
    // e recurrenceType (tipo de recorrência do plano de assinatura).
    const { uid, recurrenceType } = body;
  
    // Verifica se os parâmetros foram fornecidos e não estão vazios.
    if (uid && recurrenceType && uid !== "" && recurrenceType !== "") {
      // Define o ID do preço no Stripe com base no tipo de recorrência.
      // - 1 = plano mensal
      // - 2 = plano trimestral
      // - 3 = plano anual
      const price_id = recurrenceType === 1 ? 
      process.env.STRIPE_TEST_MONTHLY_PRICE_ID
      : recurrenceType === 2 ? 
      process.env.STRIPE_TEST_QUARTERLY_PRICE_ID
      : recurrenceType === 3 &&
      process.env.STRIPE_TEST_ANNUAL_PRICE_ID;
      
      // Busca todos os links de pagamento já existentes na conta do Stripe.
      const paymentLinks = await stripe.paymentLinks.list();
  
      // Percorre os links de pagamento já criados para verificar
      // se já existe um link válido para este usuário com o mesmo tipo de recorrência.
      for (let i = 0; i < paymentLinks.data.length; i++) {
        if (
          paymentLinks.data[i].metadata.user_id === uid && // Confere o usuário
          paymentLinks.data[i].metadata.recurrenceType === `${recurrenceType}` && // Confere o tipo de recorrência
          paymentLinks.data[i].active // Confere se o link ainda está ativo
        ) {
          // Caso encontre, retorna o link existente em vez de criar um novo.
          return Response.json(
            { success: true, payment_link: paymentLinks.data[i].url },
            { status: 200 }
          );
        }
      }
  
      // Caso não exista link ativo para este usuário e tipo de recorrência,
      // cria um novo link de pagamento no Stripe.
      const paymentLink = await stripe.paymentLinks.create(
        recurrenceType === 1 ? // Se for plano mensal, inclui período de teste
        {
          line_items: [
            {
              price: price_id, // ID do preço correspondente ao plano escolhido
              quantity: 1,
            },
          ],
          metadata: {
            user_id: uid,
            recurrenceType: recurrenceType
          },
          allow_promotion_codes: true, // Permite uso de cupons de desconto
          after_completion: { // Configura redirecionamento após o pagamento
            type: "redirect",
            redirect: {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment-finished`
            }
          },
          restrictions: { // Restrição: o link só pode ser usado uma vez
            completed_sessions: {
              limit: 1
            }
          },
          subscription_data: {
            trial_period_days: 7 // Adiciona 7 dias de teste grátis
          }
        } : {
          // Caso seja trimestral ou anual, a configuração é similar
          // mas sem período de teste.
          line_items: [
            {
              price: price_id,
              quantity: 1,
            },
          ],
          metadata: {
            user_id: uid,
            recurrenceType: recurrenceType
          },
          allow_promotion_codes: true,
          after_completion: {
            type: "redirect",
            redirect: {
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment-finished`
            }
          },
          restrictions: {
            completed_sessions: {
              limit: 1
            }
          }
        }
      );
  
      // Retorna o novo link de pagamento criado com sucesso.
      return Response.json(
        { success: true, payment_link: paymentLink.url },
        { status: 201 }
      );
    } else {
      // Caso os parâmetros não sejam fornecidos corretamente,
      // retorna erro com status 400 (requisição inválida).
      return Response.json(
        { error: "Parâmetros inválidos fornecidos." },
        { status: 400 }
      );
    }
  })
}
