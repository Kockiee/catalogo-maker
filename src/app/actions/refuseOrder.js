// Este arquivo define a função que exclui um pedido do sistema.
// Serve para remover pedidos cancelados ou recusados do banco de dados.

'use server'

// Importa o banco de dados do Firebase
import { db } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { deleteDoc, doc } from "firebase/firestore";

/**
 * Exclui um pedido do banco de dados
 * @param {string} orderId - ID do pedido a ser excluído
 */
export async function refuseOrder(orderId) {
    // Cria referência ao documento do pedido
    const docRef = doc(db, "orders", orderId);
    // Exclui o pedido do banco de dados
    await deleteDoc(docRef);
}