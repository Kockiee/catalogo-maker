// Este arquivo define a função que vincula uma sessão do WhatsApp a um catálogo.
// Serve para ativar a integração do catálogo com o WhatsApp, permitindo envio de mensagens.

'use server'

// Importa o banco de dados do Firebase
import { db } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { doc, updateDoc } from "firebase/firestore";

/**
 * Vincula uma sessão do WhatsApp ao catálogo
 * @param {string} sessionId - ID da sessão do WhatsApp
 * @param {string} sessionToken - Token da sessão do WhatsApp
 * @param {string|null} catalogId - ID do catálogo (opcional)
 * @returns {Object} Mensagem de sucesso
 */
export async function setCatalogWhatsapp(sessionId, sessionToken, catalogId = null) {
    // Se não foi informado o ID do catálogo, extrai do sessionId
    const catalog = catalogId ?? sessionId.split('-')[0];
    // Cria referência ao documento do catálogo
    const docRef = doc(db, "catalogs", catalog);

    // Atualiza o catálogo no banco de dados com os dados da sessão do WhatsApp
    await updateDoc(docRef, {
        whatsapp_session: sessionId,
        whatsapp_session_token: sessionToken
    });

    // Retorna mensagem de sucesso
    return {message: "catalog-session-vinculated"};
}