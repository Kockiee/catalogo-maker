// Este arquivo define a função que cancela um pedido em uma loja virtual.
// Quando um pedido é cancelado, o cliente recebe uma mensagem no WhatsApp informando o motivo do cancelamento.
// O dono do catálogo também recebe uma notificação sobre o pedido cancelado.
// O pedido é removido do banco de dados.

'use server'

import { sendMessage } from "./sendMessage";
import { refuseOrder } from "./refuseOrder";
import { getChatId } from "./getChatId";

export async function cancelOrder(formdata, order, waSession) {
    // Extrai o motivo do cancelamento do formulário
    const reason = formdata.get('reason');
    // Remove o pedido do banco de dados
    await refuseOrder(order.id)
    // Envia mensagem para o cliente informando que o pedido foi cancelado e o motivo
    const response = await sendMessage(waSession.id, waSession.token, `${order.buyer_phone}@c.us`, `
        *Seu Pedido em ${order.store_name} Foi Cancelado*

        *Pedido:* ${order.id}
        *Motivo:* ${reason}

        *PRODUTOS*
        ${order.content.map((item) => `❌ ${item.quantity} x ${item.name}
            ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
        `).join('\n')}
        *TOTAIS*
        *Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        ---------------------------------
        *Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    `)

    // Se a mensagem foi enviada com sucesso
    if (response.status === 200) {
        // Obtém o chatId do dono do catálogo
        const catalogOwnerChatId = await getChatId(waSession.id, waSession.token);

        // Envia mensagem para o dono do catálogo informando sobre o pedido cancelado
        await sendMessage(process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION, process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION_TOKEN, catalogOwnerChatId, `
*Pedido Cancelado*

*Pedido:* ${order.id}
*Loja*: ${order.store_name}
*Cliente/Comprador:* ${order.buyer_name}
*Catálogo:* ${order.catalog_id}
*Número do Cliente:* ${order.buyer_phone}
*Motivo:* ${reason}

*PRODUTOS*
${order.content.map((item) => `❌ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        `)
    }
}