// Este arquivo define a função que exclui catálogos do sistema.
// Para cada catálogo informado, remove todos os produtos relacionados, apaga arquivos do armazenamento e encerra a sessão do WhatsApp vinculada.
// Por fim, exclui o próprio catálogo do banco de dados.

'use server'

// Importa o banco de dados do Firebase
import { db } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { deleteDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
// Importa função para deletar sessão do WhatsApp
import { deleteWhatsappSession } from "./deleteWhatsappSession";
// Importa função para deletar diretório de arquivos do catálogo
import { deleteStorageDirectory } from "./deleteStorageDirectory";

/**
 * Exclui uma lista de catálogos e todos os dados relacionados
 * @param {Array} catalogs - Lista de catálogos a serem excluídos
 * @param {string} userId - ID do usuário dono dos catálogos
 */
export async function deleteCatalogs(catalogs, userId) {
    // Percorre cada catálogo da lista
    for (const catalog of catalogs) {
        const catalogId = catalog.id; // Obtém o ID do catálogo

        // Remove todos os arquivos do diretório do catálogo no armazenamento
        await deleteStorageDirectory(`${userId}/${catalogId}`);

        // Busca todos os produtos que pertencem ao catálogo
        const q = query(collection(db, "products"), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);
        // Se existirem produtos, exclui cada um deles
        if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref); // Exclui o produto do banco de dados
            }
        }
        // Se o catálogo possui sessão do WhatsApp vinculada, exclui a sessão
        if (catalog.whatsapp_session) await deleteWhatsappSession(catalog.whatsapp_session);
        // Exclui o próprio catálogo do banco de dados
        await deleteDoc(doc(db, "catalogs", catalogId));
    }
}