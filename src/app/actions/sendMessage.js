// Diretiva 'use server' indica que esta função é executada no servidor
'use server'

// Importação do adaptador do WhatsApp que contém a lógica de comunicação
import { WhatsappAdapter } from "../lib/WhatsappAdapter";

/**
 * Função assíncrona para enviar uma mensagem via WhatsApp
 * Esta função serve como uma interface para o WhatsappAdapter, facilitando o envio de mensagens
 * @param {string} waSessionId - ID da sessão do WhatsApp
 * @param {string} waSessionToken - Token de autenticação da sessão do WhatsApp
 * @param {string} chatId - ID do chat/conversa para onde a mensagem será enviada
 * @param {string} message - Conteúdo da mensagem a ser enviada
 * @returns {Promise} Resultado da operação de envio da mensagem
 */
export async function sendMessage(waSessionId, waSessionToken, chatId, message) {
    // Delega o envio da mensagem para o WhatsappAdapter
    return await WhatsappAdapter.sendMessage(waSessionId, waSessionToken, chatId, message);
}
