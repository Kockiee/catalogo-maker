/**
 * AÇÃO DE ENVIAR MENSAGEM VIA WHATSAPP
 * 
 * Este arquivo contém a ação server-side para enviar mensagens via WhatsApp
 * utilizando o adaptador de WhatsApp. A função é usada para notificar
 * clientes e vendedores sobre pedidos.
 * 
 * Funcionalidades:
 * - Enviar mensagem via API do WhatsApp
 * - Integração com WhatsappAdapter
 * - Suporte a mensagens formatadas
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { WhatsappAdapter } from "../lib/WhatsappAdapter"; // Importa adaptador do WhatsApp

export async function sendMessage(waSessionId, waSessionToken, chatId, message) {
    return await WhatsappAdapter.sendMessage(waSessionId, waSessionToken, chatId, message); // Envia mensagem via adaptador e retorna resposta
}
