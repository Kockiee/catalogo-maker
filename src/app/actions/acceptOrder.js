/**
 * AÇÃO DE ACEITAR PEDIDO
 * 
 * Este arquivo contém a ação server-side para aceitar um pedido e notificar
 * o comprador e vendedor via WhatsApp. A função envia mensagens formatadas
 * com os detalhes do pedido e atualiza o status no banco de dados.
 * 
 * Funcionalidades:
 * - Aceitar pedido do cliente
 * - Enviar notificação ao comprador via WhatsApp
 * - Enviar notificação ao vendedor via WhatsApp
 * - Atualizar status do pedido para "accepted"
 * - Formatação de mensagens com detalhes do pedido
 * - Formatação de preços em BRL
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { doc, updateDoc } from "firebase/firestore"; // Importa funções do Firestore
import { sendMessage } from "./sendMessage"; // Importa função para enviar mensagem
import { getChatId } from "./getChatId"; // Importa função para obter chatId

export async function acceptOrder(order, waSession) {
    // Envia mensagem de confirmação ao comprador
    const response = await sendMessage(waSession.id, waSession.token, `${order.buyer_phone}@c.us`, 
`*Seu Pedido em ${order.store_name} foi Aceito*

*Pedido:* ${order.id}
*Nome:* ${order.buyer_name}

*ENTREGA E PAGAMENTO A COMBINAR*
*AGUARDE O CONTATO DO VENDEDOR*

*PRODUTOS*
${order.content.map((item) => `✅ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

    // Se mensagem foi enviada com sucesso e não é sessão padrão
    if((response.status === 200 || response.status === 201) && waSession.id !== "catalog-maker") {
        // Obtém chatId do vendedor
        const catalogOwnerChatId = await getChatId(waSession.id, waSession.token);

        // Envia notificação ao vendedor
        await sendMessage(process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION, process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION_TOKEN, catalogOwnerChatId, 
`*Você Aceitou um Novo Pedido*

*Pedido:* ${order.id}
*Loja*: ${order.store_name}
*Cliente/Comprador:* ${order.buyer_name}
*Catálogo:* ${order.catalog_id}
*Número do Cliente:* ${order.buyer_phone}  

*ENTRE EM CONTATO COM O COMPRADOR PARA COMBINAR O PAGAMENTO E ENVIO DO PEDIDO*

*PRODUTOS*
${order.content.map((item) => `✅ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

        // Atualiza status do pedido no banco de dados
        const docRef = doc(db, 'orders', order.id); // Cria referência ao documento do pedido
        await updateDoc(docRef, { // Atualiza documento
            status: 'accepted', // Define status como aceito
        })
    }
}
