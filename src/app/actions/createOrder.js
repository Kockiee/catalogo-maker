/**
 * AÇÃO DE CRIAR PEDIDO
 * 
 * Este arquivo contém a ação server-side para criar um novo pedido no
 * banco de dados Firestore. A função recebe os dados do pedido e
 * informações do comprador para criar o registro.
 * 
 * Funcionalidades:
 * - Criar novo pedido no Firestore
 * - Validar dados obrigatórios
 * - Armazenar informações do comprador
 * - Armazenar conteúdo e preço do pedido
 * - Definir status inicial como "waiting-accept"
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { addDoc, collection } from "firebase/firestore"; // Importa funções do Firestore
import { sendMessage } from "./sendMessage";

export async function createOrder(prevState, formData, catalog, order) {
    const buyerPhone = formData.get('buyerPhone'); // Obtém telefone do comprador do formulário
    const buyerName = formData.get('buyerName'); // Obtém nome do comprador do formulário

    if (buyerPhone && buyerName) { // Se os dados obrigatórios estão presentes
        const colRef = collection(db, 'orders'); // Cria referência à coleção de pedidos
        await addDoc(colRef, { // Adiciona novo documento à coleção
            catalog_id: catalog.id, // ID do catálogo
            catalog_name: catalog.name, // Nome do catálogo
            catalog_owner: catalog.owner, // Proprietário do catálogo
            store_name: catalog.store_name, // Nome da loja
            buyer_name: buyerName, // Nome do comprador
            buyer_phone: buyerPhone, // Telefone do comprador
            content: order.content, // Conteúdo do pedido (array de produtos)
            price: order.price, // Preço total do pedido
            status: 'waiting-accept', // Status inicial aguardando aceitação
            created_at: new Date() // Data de criação do pedido
        });

        console.log(order);

        await sendMessage(
        catalog.whatsapp_session, 
        catalog.whatsapp_session_token, 
        `${buyerPhone}@c.us`, 
`Olá *${buyerName}* 👋
*Seu Pedido em ${catalog.store_name} foi enviado ao vendedor* 

VOCÊ SERÁ NOTIFICADO QUANDO O VENDEDOR ACEITAR SEU PEDIDO.

*PRODUTOS*
${order.content.map((item) => `✅ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

        return {message: 'order-created'}; // Retorna mensagem de sucesso
    } else {
        return {message: "invalid-params"}; // Retorna erro de parâmetros inválidos
    }
}
