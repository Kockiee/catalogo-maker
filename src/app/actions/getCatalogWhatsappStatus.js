/**
 * AÇÃO DE OBTER STATUS DO WHATSAPP DO CATÁLOGO
 * 
 * Este arquivo contém a ação server-side para verificar o status de uma
 * sessão do WhatsApp vinculada a um catálogo. Retorna informações sobre
 * o estado da conexão.
 * 
 * Funcionalidades:
 * - Verificar status da sessão do WhatsApp
 * - Integração com WhatsappAdapter
 * - Autenticação com token da sessão
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { WhatsappAdapter } from "../lib/WhatsappAdapter"; // Importa adaptador do WhatsApp

export async function getCatalogWhatsappStatus(sessionId, sessionToken) {
    return await WhatsappAdapter.getSessionStatus(sessionId, sessionToken); // Obtém status da sessão via adaptador e retorna
}
