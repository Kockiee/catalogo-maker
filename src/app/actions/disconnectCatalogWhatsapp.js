// Este arquivo define a função que desconecta um catálogo da sua sessão do WhatsApp.
// Serve para remover a integração do catálogo com o WhatsApp, apagando a sessão e atualizando o banco de dados.

'use server'

// Importa o banco de dados do Firebase
import { db } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { doc, updateDoc } from "firebase/firestore";
// Importa função para deletar sessão do WhatsApp
import { deleteWhatsappSession } from "./deleteWhatsappSession";

/**
 * Desconecta o catálogo da sessão do WhatsApp
 * @param {string} catalogId - ID do catálogo
 * @param {string} whatsappSession - ID da sessão do WhatsApp
 * @param {string} whatsappSessionToken - Token da sessão do WhatsApp
 * @returns {Object} Resultado da operação
 */
export async function disconnectCatalogWhatsapp(catalogId, whatsappSession, whatsappSessionToken) {
    try {
        // Se existe uma sessão do WhatsApp, tenta deletar
        if (whatsappSession) {
            const deleteWhatsappSessionData = await deleteWhatsappSession(whatsappSession, whatsappSessionToken);
            // Se houve erro ao deletar a sessão, retorna falha
            if (deleteWhatsappSessionData.status === "ERROR") {
                return { success: false, message: "Erro ao deletar sessão do WhatsApp" };
            }
        }

        // Atualiza o catálogo no banco de dados, removendo os dados da sessão do WhatsApp
        const catalogRef = doc(db, "catalogs", catalogId);
        await updateDoc(catalogRef, {
            whatsapp_session: null,
            whatsapp_session_token: null
        });

        // Retorna sucesso
        return { success: true, message: "Sessão do WhatsApp desconectada com sucesso!" };
    } catch (error) {
        // Se ocorrer erro, exibe no console e retorna falha
        console.error("Erro ao desconectar sessão do WhatsApp:", error);
        return { success: false, message: "Erro ao desconectar sessão do WhatsApp" };
    }
}
