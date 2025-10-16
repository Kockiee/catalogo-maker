/**
 * API Route para Webhook do Stripe
 * 
 * Este arquivo gerencia os webhooks do Stripe, que são notificações automáticas
 * enviadas pelo Stripe quando eventos importantes ocorrem (pagamentos, cancelamentos, etc.).
 * Processa eventos de pagamento bem-sucedido para ativar contas premium e
 * eventos de cancelamento para desativar assinaturas.
 */

// Configura o cliente do Stripe com a chave de teste
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
// Importa a função para acessar headers da requisição
import { headers } from 'next/headers';
// Importa as funções necessárias do Firestore para manipulação de dados
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
// Importa a conexão com o banco de dados Firebase
import { db } from '../../utils/firebase';

/**
 * Função principal para processar webhooks do Stripe
 * Método HTTP: POST
 * Autenticação: Verificação de assinatura do Stripe
 */
export async function POST(req) {
  // Obtém o corpo da requisição como texto (necessário para verificação de assinatura)
  const body = await req.text();
  // Obtém os headers da requisição
  const headersList = headers();
  // Extrai a assinatura do Stripe do header 'stripe-signature'
  const sig = headersList.get('stripe-signature');
  // Obtém o segredo do webhook das variáveis de ambiente
  const endpointSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;

  // Variável para armazenar o evento decodificado
  let event;

  try {
    // Constrói e verifica o evento usando a assinatura do Stripe
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    // Retorna erro se a verificação da assinatura falhar
    return Response.json({message: err.message}, {status: 400});
  };

  // Processa evento de pagamento bem-sucedido
  if (event.type === "checkout.session.completed" && 
      event.data.object.payment_status === "paid" && 
      event.data.object.metadata.user_id) {
    // Obtém o ID do usuário dos metadados do evento
    const userId = event.data.object.metadata.user_id;
    // Cria uma referência para o documento do usuário
    const userRef = doc(db, "accounts", userId);
    // Atualiza o usuário para premium e salva o ID da assinatura
    await updateDoc(userRef, {
      premium: true,                                    // Marca como premium
      last_subscription_id: event.data.object.subscription  // Salva ID da assinatura
    });
  };

  // Processa evento de cancelamento de assinatura
  if (event.type === "customer.subscription.deleted" && 
      event.data.object.status === "canceled") {
    // Obtém o ID da assinatura cancelada
    const subscriptionId = event.data.object.id;
    // Busca todos os usuários com esta assinatura
    const q = query(collection(db, "accounts"), where("last_subscription_id", "==", subscriptionId));
    const querySnapshot = await getDocs(q);
    // Atualiza cada usuário encontrado para remover o status premium
    for(const doc of querySnapshot) {
      await updateDoc(doc.ref, {
        premium: false  // Remove o status premium
      });
    }
  };

  // Retorna sucesso após processar o webhook
  return Response.json({status: 200});
};

// Comandos úteis para desenvolvimento local:
// stripe trigger checkout.session.completed  - Simula evento de pagamento
// stripe listen --forward-to localhost:3000/api/webhook  - Inicia ouvinte local