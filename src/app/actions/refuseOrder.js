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

export async function refuseOrder(orderId) {
    const docRef = doc(db, "orders", orderId); // Cria referência ao documento do pedido
    await deleteDoc(docRef) // Deleta o documento do pedido
}
