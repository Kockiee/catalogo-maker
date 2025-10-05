/**
 * AÇÃO DE DELETAR PRODUTOS
 * 
 * Este arquivo contém a ação server-side para deletar múltiplos produtos
 * do banco de dados e suas imagens do storage. A função itera sobre
 * um array de IDs de produtos.
 * 
 * Funcionalidades:
 * - Deletar múltiplos produtos
 * - Remover documentos do Firestore
 * - Deletar imagens do Storage
 * - Limpeza completa de recursos
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { deleteDoc, doc, getDoc } from "firebase/firestore"; // Importa funções do Firestore
import { deleteStorageDirectory } from "./deleteStorageDirectory"; // Importa função para deletar diretório do storage

export async function deleteProducts(products) {
    for (const productId of products) { // Itera sobre cada ID de produto
        const docRef = doc(db, "products", productId); // Cria referência ao documento do produto
        const docSnap = await getDoc(docRef); // Busca dados do produto
        
        await deleteDoc(docRef); // Deleta o documento do Firestore
        
        // Deleta diretório de imagens do produto no Storage
        await deleteStorageDirectory(`${docSnap.data().owner}/${docSnap.data().catalog}/products/${productId}`);
    }
}
