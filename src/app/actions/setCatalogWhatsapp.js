/**
 * AÇÃO DE VINCULAR WHATSAPP AO CATÁLOGO
 * 
 * Este arquivo contém a ação server-side para vincular uma sessão do WhatsApp
 * a um catálogo específico. Atualiza o banco de dados com as informações
 * da sessão para permitir envio de notificações.
 * 
 * Funcionalidades:
 * - Vincular sessão do WhatsApp ao catálogo
 * - Atualizar dados do catálogo no Firestore
 * - Salvar ID e token da sessão
 * - Suporte a catalogId opcional
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { doc, updateDoc } from "firebase/firestore"; // Importa funções do Firestore

export async function setCatalogWhatsapp(sessionId, sessionToken, catalogId = null) {
    const catalog = catalogId ?? sessionId.split('-')[0]; // Se catalogId não fornecido, extrai do sessionId
    const docRef = doc(db, "catalogs", catalog); // Cria referência ao documento do catálogo
        
    await updateDoc(docRef, { // Atualiza documento do catálogo
        whatsapp_session: sessionId, // Salva ID da sessão
        whatsapp_session_token: sessionToken // Salva token da sessão
    });

    return {message: "catalog-session-vinculated"}; // Retorna mensagem de sucesso
}
