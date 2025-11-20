/**
 * AÇÃO DE RECUSAR PEDIDO
 * 
 * Este arquivo contém a ação server-side para recusar e deletar um pedido
 * do banco de dados Firestore. Esta função é chamada quando o vendedor
 * recusa um pedido do cliente.
 * 
 * Funcionalidades:
 * - Deletar pedido do banco de dados
 * - Remoção permanente do registro
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { deleteDoc, doc } from "firebase/firestore"; // Importa funções do Firestore
import { sendMessage } from "./sendMessage";

export async function refuseOrder(order, waSession = null, needNotification = true) {
    if(needNotification) {
        // Envia notificação ao comprador informando recusa do pedido
        await sendMessage(
        waSession.id, 
        waSession.token,
        `${order.buyer_phone}@c.us`, 
`❌ *Seu Pedido em ${order.store_name} foi recusado pelo vendedor* ❌

*Pedido:* ${order.id}
*Loja*: ${order.store_name}

*PRODUTOS*
${order.content.map((item) => `❌ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    }
    
    const docRef = doc(db, "orders", order.id); // Cria referência ao documento do pedido
    await deleteDoc(docRef) // Deleta o documento do pedido
}
