'use server'

import { sendMessage } from "./sendMessage";
import { refuseOrder } from "./refuseOrder";
import { getChatId } from "./getChatId";

export async function cancelOrder(formdata, order, waSession) {
    const reason = formdata.get('reason');
    await refuseOrder(order.id)
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

    if (response.status === 200) {
        const catalogOwnerChatId = await getChatId(waSession.id, waSession.token);

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
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        `)
    }
}