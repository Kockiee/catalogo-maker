// Este arquivo define a função que verifica o status da sessão do WhatsApp vinculada ao catálogo.
// Serve para saber se a integração com o WhatsApp está ativa ou não.

'use server'

// Importa o adaptador que faz a comunicação com o WhatsApp
import { WhatsappAdapter } from "../lib/WhatsappAdapter";

/**
 * Verifica o status da sessão do WhatsApp
 * @param {string} sessionId - ID da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @returns {Promise} Status da sessão
 */
export async function getCatalogWhatsappStatus(sessionId, sessionToken) {
    // Chama o método do adaptador para obter o status da sessão
    return await WhatsappAdapter.getSessionStatus(sessionId, sessionToken);
}