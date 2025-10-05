/**
 * AÇÃO DE DELETAR SESSÃO DO WHATSAPP
 * 
 * Este arquivo contém a ação server-side para deletar uma sessão do WhatsApp.
 * Esta função é chamada quando o usuário desconecta o WhatsApp de um catálogo
 * ou quando o catálogo é deletado.
 * 
 * Funcionalidades:
 * - Deletar sessão do WhatsApp via API
 * - Integração com WhatsappAdapter
 * - Limpeza de recursos da sessão
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { WhatsappAdapter } from "../lib/WhatsappAdapter"; // Importa adaptador do WhatsApp

export async function deleteWhatsappSession(sessionId, sessionToken) {
    return await WhatsappAdapter.deleteSession(sessionId, sessionToken); // Deleta sessão via adaptador e retorna resposta
}
