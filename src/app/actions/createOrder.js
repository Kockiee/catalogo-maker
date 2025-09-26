// Este arquivo define a função que cria um novo pedido para um catálogo de loja virtual.
// O pedido reúne informações do comprador, produtos, preço e status.
// Se os dados obrigatórios estiverem presentes, o pedido é salvo no banco de dados.
// Caso contrário, retorna uma mensagem de erro.

'use server'

import { db } from "../utils/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function createOrder(prevState, formData, catalogId, catalogName, storeName, catalogOwner, order, orderPrice) {
    // Extrai o telefone e nome do comprador do formulário
    const buyerPhone = formData.get('buyerPhone');
    const buyerName = formData.get('buyerName');

    // Verifica se os dados obrigatórios do comprador estão presentes
    if (buyerPhone && buyerName) {
        // Cria referência para a coleção 'orders' no banco de dados
        const colRef = collection(db, 'orders');
        // Adiciona o pedido ao banco de dados com todas as informações
        await addDoc(colRef, {
            catalog_id: catalogId,
            catalog_name: catalogName,
            catalog_owner: catalogOwner,
            store_name: storeName,
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            content: order,
            price: orderPrice,
            status: 'waiting-accept',
            created_at: new Date()
        });

        // Retorna mensagem de sucesso
        return {message: 'order-created'};
    } else {
        // Se faltar algum dado obrigatório, retorna erro
        return {message: "invalid-params"};
    }
}