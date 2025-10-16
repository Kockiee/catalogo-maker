/**
 * AÇÃO DE CANCELAR PEDIDO
 * 
 * Este arquivo contém a ação server-side para cancelar um pedido e notificar
 * o comprador e vendedor via WhatsApp. A função deleta o pedido do banco,
 * envia mensagens formatadas com motivo do cancelamento.
 * 
 * Funcionalidades:
 * - Cancelar e deletar pedido
 * - Enviar notificação ao comprador com motivo
 * - Enviar notificação ao vendedor
 * - Formatação de mensagens com detalhes do pedido
 * - Formatação de preços em BRL
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { sendMessage } from "./sendMessage"; // Importa função para enviar mensagem
import { refuseOrder } from "./refuseOrder"; // Importa função para recusar pedido
import { getChatId } from "./getChatId"; // Importa função para obter chatId

export async function cancelOrder(formdata, order, waSession) {
    const reason = formdata.get('reason'); // Obtém motivo do cancelamento do formulário
    await refuseOrder(order.id) // Deleta pedido do banco de dados
    
    // Envia mensagem de cancelamento ao comprador
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

    // Se mensagem foi enviada com sucesso
    if (response.status === 200) {
        // Obtém chatId do vendedor
        const catalogOwnerChatId = await getChatId(waSession.id, waSession.token);

        // Envia notificação de cancelamento ao vendedor
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
