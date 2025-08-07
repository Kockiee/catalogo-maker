'use server'

import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { sendMessage } from "./sendMessage";
import { getChatId } from "./getChatId";

export async function acceptOrder(order, WhatsappSession) {
    const response = await sendMessage(WhatsappSession.id, `${order.buyer_phone}@c.us`, 
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

    if(response.status === 200 && WhatsappSession.id !== "catalog-maker") {
        const catalogOwnerChatId = await getChatId(WhatsappSession.id);

        await sendMessage(process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION, catalogOwnerChatId, 
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

        const docRef = doc(db, 'orders', order.id);
        await updateDoc(docRef, {
            status: 'accepted',
        })
    }
}