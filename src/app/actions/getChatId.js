// Este arquivo define a função que obtém o ID de um chat/conversa no WhatsApp.
// Serve para identificar para onde enviar mensagens via WhatsApp.

'use server'

// Importa o adaptador que faz a comunicação com o WhatsApp
import { WhatsappAdapter } from "../lib/WhatsappAdapter";

/**
 * Obtém o ID do chat no WhatsApp
 * @param {string} waSessionId - ID da sessão do WhatsApp
 * @param {string} waSessionToken - Token de autenticação da sessão
 * @returns {Promise} ID do chat
 */
export async function getChatId(waSessionId, waSessionToken) {
    // Chama o método do adaptador para obter o ID do chat
    return await WhatsappAdapter.getChatId(waSessionId, waSessionToken);
}