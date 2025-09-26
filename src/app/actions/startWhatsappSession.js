// Este arquivo define a função que inicia uma sessão do WhatsApp para o catálogo.
// Serve para ativar a comunicação do catálogo com o WhatsApp.

'use server'

// Importa o adaptador que faz a comunicação com o WhatsApp
import { WhatsappAdapter } from "../lib/WhatsappAdapter";

/**
 * Inicia uma sessão do WhatsApp
 * @param {string} sessionId - ID da sessão do WhatsApp
 * @param {string|null} sessionToken - Token da sessão (se já existir)
 * @returns {Promise} Resultado da operação
 */
export async function startWhatsappSession(sessionId, sessionToken) {
    // Chama o método do adaptador para iniciar a sessão
    return await WhatsappAdapter.startSession(sessionId, sessionToken);
}