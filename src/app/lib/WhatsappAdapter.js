// Adaptador para comunicação com a API do WhatsApp
// Este arquivo contém funções para gerenciar sessões e enviar mensagens via WhatsApp

// URL base da API do WhatsApp obtida das variáveis de ambiente
const API_URL = process.env.WHATSAPP_API_URL;
// Chave da API do WhatsApp obtida das variáveis de ambiente
const API_KEY = process.env.WHATSAPP_API_KEY;

/**
 * Função assíncrona para enviar uma mensagem via WhatsApp
 * Implementa retry automático em caso de desconexão da sessão
 * @param {string} sessionId - ID único da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @param {string} chatId - Número do telefone ou ID do chat para enviar a mensagem
 * @param {string} message - Conteúdo da mensagem a ser enviada
 * @returns {Promise<Response>} Resposta da API do WhatsApp
 */
async function sendMessage(sessionId, sessionToken, chatId, message) {
    // Função interna para fazer a requisição de envio de mensagem
    const sendRequest = async () => {
        // Faz uma requisição POST para a API do WhatsApp com os dados da mensagem
        const response = await fetch(`${API_URL}/api/${sessionId}/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify({
                phone: chatId,         // Número do telefone de destino
                isGroup: false,        // Flag indicando se é um grupo
                isNewsletter: false,   // Flag indicando se é um boletim informativo
                isLid: false,          // Flag indicando se é um contato não salvo
                message: message       // Conteúdo da mensagem
            })
        });
        // Converte a resposta para JSON
        const data = await response.json();
        // Retorna tanto a resposta quanto os dados
        return { response, data };
    };

    // Contador de tentativas de envio
    let attempts = 0;
    // Faz a primeira tentativa de envio
    let { response, data } = await sendRequest();

    // Loop de retry: tenta novamente se a sessão estiver desconectada
    while (data.status === "Disconnected" && attempts < 2) {
        attempts++;                               // Incrementa o contador de tentativas
        await new Promise(resolve => setTimeout(resolve, 500)); // Aguarda 500ms
        ({ response, data } = await sendRequest()); // Tenta enviar novamente
    }

    // Retorna a resposta final (sucesso ou erro)
    return response;
}

/**
 * Função assíncrona para deletar/encerrar uma sessão do WhatsApp
 * Esta função fecha a sessão e limpa todos os dados associados
 * @param {string} sessionId - ID único da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @returns {Promise<Object>} Objeto com status e mensagem do resultado da operação
 */
async function deleteSession(sessionId, sessionToken) {
    // URLs para fechar a sessão e limpar os dados
    const closeSessionUrl = `${API_URL}/api/${sessionId}/close-session`;
    const clearSessionDataUrl = `${API_URL}/api/${sessionId}/${API_KEY}/clear-session-data`;

    // Cabeçalhos comuns para ambas as requisições
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Fecha a sessão do WhatsApp
    const closeSessionResponse = await fetch(closeSessionUrl, {
        method: 'POST',
        headers
    });
    const closeSessionData = await closeSessionResponse.json();

    // Limpa todos os dados da sessão
    const clearSessionDataResponse = await fetch(clearSessionDataUrl, {
        method: 'POST',
        headers
    });
    const clearSessionDataData = await clearSessionDataResponse.json();

    // Verifica se ambas as operações foram bem-sucedidas
    if (closeSessionData.status && clearSessionDataData.success) {
        return { status: "SUCCESS", message: "Sessão do WhatsApp deletada com sucesso" };
    } else {
        return { status: "ERROR", message: "Erro ao deletar sessão do WhatsApp" };
    }
}

/**
 * Função assíncrona para iniciar uma nova sessão do WhatsApp
 * Gera um token se não for fornecido e inicia a sessão
 * @param {string} sessionId - ID único da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão (opcional)
 * @returns {Promise<Object>} Objeto com dados da sessão iniciada (token, QR code, etc.)
 */
async function startSession(sessionId, sessionToken) {
    // Usa o token fornecido ou inicializa como o parâmetro passado
    let token = sessionToken;

    // Verifica se é necessário gerar um novo token
    if (sessionToken === "" || !sessionToken || sessionToken === null) {
        // Gera um novo token para a sessão usando a API
        const generateSessionToken = await fetch(`${API_URL}/api/${sessionId}/${API_KEY}/generate-token`, {method: 'POST'});
        const sessionTokenData = await generateSessionToken.json();
        token = sessionTokenData.token // Atualiza o token com o gerado
    }

    // Cabeçalhos para a requisição de início de sessão
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Inicia a sessão do WhatsApp com configurações específicas
    const startingSession = await fetch(`${API_URL}/api/${sessionId}/start-session`, {
        method: 'POST',
        body: JSON.stringify({
            "webhook": "",         // URL do webhook (vazio neste caso)
            "waitQrCode": false    // Flag para esperar o QR code
        }),
        headers
    });

    // Converte a resposta para JSON
    const sessionStartData = await startingSession.json();

    // Retorna os dados da sessão iniciada
    return {
        message: 'success',           // Mensagem de sucesso
        token: token,                 // Token de autenticação da sessão
        qr: sessionStartData.qrcode,  // QR code para autenticação (se necessário)
        urlCode: sessionStartData.urlcode // URL do código (se necessário)
    };
}

/**
 * Função assíncrona para obter o status atual de uma sessão do WhatsApp
 * Implementa retry automático em caso de status fechado
 * @param {string} sessionId - ID único da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @returns {Promise<Object>} Objeto com o status atual da sessão
 */
async function getSessionStatus(sessionId, sessionToken) {
    // Cabeçalhos para a requisição de status
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Função interna para verificar o status da sessão
    const checkStatus = async () => {
        // Faz requisição para obter o status da sessão
        const response = await fetch(`${API_URL}/api/${sessionId}/status-session`, { headers });
        const data = await response.json();
        return data;
    };

    // Contador de tentativas
    let attempts = 0;
    // Faz a primeira verificação de status
    let data = await checkStatus();

    // Loop de retry: tenta novamente se a sessão estiver fechada
    while (data.status === "CLOSED" && attempts < 2) {
        attempts++;                               // Incrementa o contador
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
        data = await checkStatus();               // Verifica o status novamente
    }

    // Retorna o status final da sessão
    return { status: data.status };
}

/**
 * Função assíncrona para obter o ID do chat/número da sessão atual
 * @param {string} sessionId - ID único da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @returns {Promise<string>} ID do chat/número de telefone da sessão
 */
async function getChatId(sessionId, sessionToken) {
    // Cabeçalhos para a requisição
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Faz requisição para obter o número de telefone da sessão
    const response = await fetch(`${API_URL}/api/${sessionId}/get-phone-number`, { headers });
    const data = await response.json();
    // Retorna o número de telefone da resposta
    return data.response;
}


// Exporta o adaptador do WhatsApp como um objeto contendo todas as funções
export const WhatsappAdapter = {
    sendMessage,      // Função para enviar mensagens
    deleteSession,    // Função para deletar/encerrar sessões
    startSession,     // Função para iniciar novas sessões
    getSessionStatus, // Função para verificar status das sessões
    getChatId         // Função para obter ID do chat
};