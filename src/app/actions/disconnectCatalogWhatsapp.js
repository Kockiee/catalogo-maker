/**
 * AÇÃO DE DESCONECTAR WHATSAPP DO CATÁLOGO
 * 
 * Este arquivo contém a ação server-side para desconectar uma sessão do WhatsApp
 * de um catálogo. A função deleta a sessão da API do WhatsApp e remove as
 * referências do banco de dados.
 * 
 * Funcionalidades:
 * - Desconectar sessão do WhatsApp do catálogo
 * - Deletar sessão via API do WhatsApp
 * - Remover referências do Firestore
 * - Tratamento de erros
 * - Retorno de status da operação
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { db } from "../utils/firebase"; // Importa instância do banco de dados
import { doc, updateDoc } from "firebase/firestore"; // Importa funções do Firestore
import { deleteWhatsappSession } from "./deleteWhatsappSession"; // Importa função para deletar sessão

export async function disconnectCatalogWhatsapp(catalogId, whatsappSession, whatsappSessionToken) {
    try { // Tenta executar a operação
        // Deletar a sessão do WhatsApp
        if (whatsappSession) { // Se existe sessão vinculada
            const deleteWhatsappSessionData = await deleteWhatsappSession(whatsappSession, whatsappSessionToken); // Deleta sessão via API
            if (deleteWhatsappSessionData.status === "ERROR") { // Se houve erro na deleção
                return { success: false, message: "Erro ao deletar sessão do WhatsApp" }; // Retorna erro
            }
        }

        // Atualizar o catálogo removendo a sessão do WhatsApp
        const catalogRef = doc(db, "catalogs", catalogId); // Cria referência ao documento do catálogo
        await updateDoc(catalogRef, { // Atualiza documento
            whatsapp_session: null, // Remove ID da sessão
            whatsapp_session_token: null // Remove token da sessão
        });

        return { success: true, message: "Sessão do WhatsApp desconectada com sucesso!" }; // Retorna sucesso
    } catch (error) { // Se houver erro
        console.error("Erro ao desconectar sessão do WhatsApp:", error); // Registra erro no console
        return { success: false, message: "Erro ao desconectar sessão do WhatsApp" }; // Retorna erro
    }
}
