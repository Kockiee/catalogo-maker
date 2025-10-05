/**
 * AÇÃO DE OBTER ID DO CHAT
 * 
 * Este arquivo contém a ação server-side para obter o ID do chat do WhatsApp
 * de uma sessão específica. O chatId é necessário para enviar mensagens.
 * 
 * Funcionalidades:
 * - Obter chatId da sessão do WhatsApp
 * - Integração com WhatsappAdapter
 * - Autenticação com token da sessão
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { WhatsappAdapter } from "../lib/WhatsappAdapter"; // Importa adaptador do WhatsApp

export async function getChatId(waSessionId, waSessionToken) {
    return await WhatsappAdapter.getChatId(waSessionId, waSessionToken); // Obtém chatId via adaptador e retorna
}
