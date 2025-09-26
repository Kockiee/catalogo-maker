// Este arquivo define a função que exclui produtos do sistema.
// Para cada produto informado, remove o registro do banco de dados e apaga os arquivos relacionados do armazenamento.

'use server'

// Importa o banco de dados do Firebase
import { db } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { deleteDoc, doc, getDoc } from "firebase/firestore";
// Importa função para deletar diretório de arquivos do produto
import { deleteStorageDirectory } from "./deleteStorageDirectory";

/**
 * Exclui uma lista de produtos e seus arquivos
 * @param {Array} products - Lista de IDs dos produtos a serem excluídos
 */
export async function deleteProducts(products) {
    // Percorre cada produto da lista
    for (const productId of products) {
        // Cria referência ao documento do produto
        const docRef = doc(db, "products", productId);
        // Busca os dados do produto no banco de dados
        const docSnap = await getDoc(docRef);

        // Exclui o produto do banco de dados
        await deleteDoc(docRef);

        // Exclui os arquivos do produto do armazenamento
        await deleteStorageDirectory(`${docSnap.data().owner}/${docSnap.data().catalog}/products/${productId}`);
    }
}