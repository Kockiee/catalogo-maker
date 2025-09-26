// Este arquivo define a função que exclui uma sessão do WhatsApp vinculada ao catálogo.
// Serve para encerrar a comunicação do catálogo com o WhatsApp.

'use server'

// Importa o adaptador que faz a comunicação com o WhatsApp
import { WhatsappAdapter } from "../lib/WhatsappAdapter";

/**
 * Exclui uma sessão do WhatsApp
 * @param {string} sessionId - ID da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @returns {Promise} Resultado da operação de exclusão
 */
export async function deleteWhatsappSession(sessionId, sessionToken) {
    // Chama o método do adaptador para excluir a sessão
    return await WhatsappAdapter.deleteSession(sessionId, sessionToken);
}