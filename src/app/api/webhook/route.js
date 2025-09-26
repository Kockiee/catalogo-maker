// Importação do SDK do Stripe com a chave secreta de teste
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
// Importação da função headers do Next.js para acessar os cabeçalhos da requisição
import { headers } from 'next/headers';
// Importação das funções do Firestore para manipulação de documentos e consultas
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
// Importação da configuração do banco de dados Firebase
import { db } from '../../utils/firebase';

/**
 * Função handler para requisições POST no webhook do Stripe
 * Esta função processa eventos enviados pelo Stripe, como pagamentos e cancelamentos de assinatura
 * @param {Request} req - O objeto de requisição HTTP contendo os dados do webhook
 * @returns {Promise<Response>} Resposta JSON indicando o status do processamento
 */
export async function POST(req) {
  // Converte o corpo da requisição para texto (formato raw do webhook)
  const body = await req.text();
  // Obtém a lista de cabeçalhos da requisição
  const headersList = headers();
  // Extrai a assinatura do Stripe do cabeçalho para verificar a autenticidade
  const sig = headersList.get('stripe-signature');
  // Obtém o segredo do endpoint do webhook das variáveis de ambiente
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Variável para armazenar o evento do webhook
  let event;

  try {
    // Constrói o evento do webhook do Stripe usando o corpo, assinatura e segredo
    // Isso verifica se o webhook é autêntico e não foi adulterado
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    // Se houver erro na construção do evento, retorna erro 400
    return Response.json({message: err.message}, {status: 400});
  };

  // Verifica se o evento é de checkout completado com pagamento realizado
  // e se contém o ID do usuário nos metadados
  if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid" && event.data.object.metadata.user_id) {
    // Extrai o ID do usuário dos metadados do evento
    const userId = event.data.object.metadata.user_id;
    // Cria uma referência para o documento do usuário no banco de dados
    const userRef = doc(db, "accounts", userId);
    // Atualiza o status do usuário para premium e armazena o ID da assinatura
    await updateDoc(userRef, {
      premium: true, // Marca o usuário como premium
      last_subscription_id: event.data.object.subscription // Armazena o ID da assinatura
    });
  };

  // Verifica se o evento é de assinatura cancelada
  if (event.type === "customer.subscription.deleted" && event.data.object.status === "canceled") {
    // Extrai o ID da assinatura que foi cancelada
    const subscriptionId = event.data.object.id;
    // Cria uma consulta para encontrar usuários com essa assinatura
    const q = query(collection(db, "accounts"), where("last_subscription_id", "==", subscriptionId));
    // Executa a consulta para obter os usuários afetados
    const querySnapshot = await getDocs(q);
    // Itera sobre os usuários encontrados
    for(const doc of querySnapshot) {
      // Remove o status premium de cada usuário
      await updateDoc(doc.ref, {
        premium: false // Marca o usuário como não premium
      });
    }
  };

  // Retorna status 200 indicando que o webhook foi processado com sucesso
  return Response.json({status: 200});
};

// Comandos para desenvolvimento local do webhook:
// stripe trigger checkout.session.completed - Dispara um evento de teste de checkout completado
// stripe listen --forward-to localhost:3000/api/webhook - Inicia um ouvinte local que encaminha eventos para o webhook