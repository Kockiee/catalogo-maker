/**
 * AÇÃO DE INICIAR SESSÃO DO WHATSAPP
 * 
 * Este arquivo contém a ação server-side para iniciar uma nova sessão do
 * WhatsApp ou reconectar a uma sessão existente. A função retorna um QR code
 * para autenticação ou status da sessão.
 * 
 * Funcionalidades:
 * - Iniciar nova sessão do WhatsApp
 * - Reconectar a sessão existente
 * - Integração com WhatsappAdapter
 * - Geração de QR code para autenticação
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { WhatsappAdapter } from "../lib/WhatsappAdapter"; // Importa adaptador do WhatsApp

export async function startWhatsappSession(sessionId, sessionToken) { // sessionToken só será diferente de null se for uma sessão já existente
    return await WhatsappAdapter.startSession(sessionId, sessionToken); // Inicia sessão via adaptador e retorna resposta (QR code ou status)
}
