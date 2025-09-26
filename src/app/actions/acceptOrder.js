// Este arquivo define a função que aceita um pedido em uma loja virtual.
// Quando um pedido é aceito, o cliente recebe uma mensagem no WhatsApp informando que o pedido foi aprovado.
// O dono do catálogo também recebe uma notificação sobre o novo pedido aceito.
// O status do pedido é atualizado no banco de dados para 'accepted'.

'use server'

import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { sendMessage } from "./sendMessage";
import { getChatId } from "./getChatId";

export async function acceptOrder(order, waSession) {
    // Envia mensagem para o cliente informando que o pedido foi aceito
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
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

    // Se a mensagem foi enviada com sucesso e não é uma sessão padrão
    if((response.status === 200 || response.status === 201) && waSession.id !== "catalog-maker") {
        // Obtém o chatId do dono do catálogo
        const catalogOwnerChatId = await getChatId(waSession.id, waSession.token);

        // Envia mensagem para o dono do catálogo informando sobre o novo pedido aceito
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
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

        // Atualiza o status do pedido para 'accepted' no banco de dados
        const docRef = doc(db, 'orders', order.id);
        await updateDoc(docRef, {
            status: 'accepted',
        })
    }
}