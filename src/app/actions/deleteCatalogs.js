/**
 * AÇÃO DE DELETAR CATÁLOGOS
 * 
 * Este arquivo contém a ação server-side para deletar múltiplos catálogos
 * e todos os seus recursos associados (produtos, imagens, sessões WhatsApp).
 * A função faz uma limpeza completa dos dados.
 * 
 * Funcionalidades:
 * - Deletar múltiplos catálogos
 * - Remover todos os produtos associados
 * - Deletar imagens do Storage
 * - Remover sessão do WhatsApp se existir
 * - Limpeza completa de recursos
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { deleteDoc, collection, doc, getDocs, query, where } from "firebase/firestore"; // Importa funções do Firestore
import { deleteWhatsappSession } from "./deleteWhatsappSession"; // Importa função para deletar sessão do WhatsApp
import { deleteStorageDirectory } from "./deleteStorageDirectory"; // Importa função para deletar diretório do storage

export async function deleteCatalogs(catalogs, userId) {
    for (const catalog of catalogs) { // Itera sobre cada catálogo
        const catalogId = catalog.id // Obtém ID do catálogo
        
        // Deleta diretório de imagens do catálogo no Storage
        await deleteStorageDirectory(`${userId}/${catalogId}`);

        // Busca todos os produtos associados ao catálogo
        const q = query(collection(db, "products"), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q); // Executa query
        if (!querySnapshot.empty) { // Se há produtos
            for (const doc of querySnapshot.docs) { // Itera sobre cada produto
                await deleteDoc(doc.ref); // Deleta documento do produto
            }
        }
        
        // Se há sessão do WhatsApp vinculada, deleta
        if(catalog.whatsapp_session) await deleteWhatsappSession(catalog.whatsapp_session);
        
        // Deleta o documento do catálogo
        await deleteDoc(doc(db, "catalogs", catalogId));
        
    }
}
