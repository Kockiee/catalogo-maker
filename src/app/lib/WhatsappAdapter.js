/**
 * ADAPTADOR DO WHATSAPP - INTEGRAÇÃO COM API EXTERNA
 * 
 * Este arquivo contém funções para integração com uma API externa do WhatsApp,
 * permitindo envio de mensagens, gerenciamento de sessões e controle de status.
 * É um adaptador que abstrai a complexidade da API externa.
 * 
 * Funcionalidades:
 * - Envio de mensagens via WhatsApp
 * - Gerenciamento de sessões (iniciar, fechar, limpar)
 * - Verificação de status da sessão
 * - Obtenção de informações do chat
 * - Tratamento de erros e reconexão automática
 */

// Obtém URL da API do WhatsApp das variáveis de ambiente
const API_URL = process.env.WHATSAPP_API_URL;
// Obtém chave da API do WhatsApp das variáveis de ambiente
const API_KEY = process.env.WHATSAPP_API_KEY;

/**
 * Função para enviar mensagem via WhatsApp
 * @param {string} sessionId - ID da sessão do WhatsApp
 * @param {string} sessionToken - Token de autenticação da sessão
 * @param {string} chatId - ID do chat/telefone de destino
 * @param {string} message - Mensagem a ser enviada
 * @returns {Promise<Response>} - Resposta da API
 */
async function sendMessage(sessionId, sessionToken, chatId, message) {
    // Função interna para fazer a requisição de envio
    const sendRequest = async () => {
        const response = await fetch(`${API_URL}/api/${sessionId}/send-message`, {
            method: 'POST', // Método HTTP POST
            headers: {
                'Content-Type': 'application/json', // Tipo de conteúdo JSON
                'Authorization': `Bearer ${sessionToken}` // Token de autorização
            },
            body: JSON.stringify({ // Corpo da requisição em JSON
                phone: chatId, // Número do telefone de destino
                isGroup: false, // Não é um grupo
                isNewsletter: false, // Não é newsletter
                isLid: false, // Não é lead
                message: message // Mensagem a ser enviada
            })
        });
        const data = await response.json(); // Converte resposta para JSON
        return { response, data }; // Retorna resposta e dados
    };

    let attempts = 0; // Contador de tentativas
    let { response, data } = await sendRequest(); // Primeira tentativa
    
    // Loop para tentar novamente se a sessão estiver desconectada
    while (data.status === "Disconnected" && attempts < 2) {
        attempts++; // Incrementa contador
        await new Promise(resolve => setTimeout(resolve, 500)); // Aguarda 500ms
        ({ response, data } = await sendRequest()); // Tenta novamente
    }

    return response; // Retorna a resposta final
}

/**
 * Função para deletar/fechar uma sessão do WhatsApp
 * @param {string} sessionId - ID da sessão a ser deletada
 * @param {string} sessionToken - Token de autenticação
 * @returns {Promise<Object>} - Resultado da operação
 */
async function deleteSession(sessionId, sessionToken) {
    // URLs para fechar sessão e limpar dados
    const closeSessionUrl = `${API_URL}/api/${sessionId}/close-session`;
    const clearSessionDataUrl = `${API_URL}/api/${sessionId}/${API_KEY}/clear-session-data`;

    // Cabeçalhos da requisição
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Fecha a sessão do WhatsApp
    const closeSessionResponse = await fetch(closeSessionUrl, {
        method: 'POST', // Método POST
        headers // Cabeçalhos de autorização
    });
    const closeSessionData = await closeSessionResponse.json(); // Converte para JSON

    // Limpa os dados da sessão
    const clearSessionDataResponse = await fetch(clearSessionDataUrl, {
        method: 'POST', // Método POST
        headers // Cabeçalhos de autorização
    });
    const clearSessionDataData = await clearSessionDataResponse.json(); // Converte para JSON

    // Verifica se ambas as operações foram bem-sucedidas
    if (closeSessionData.status && clearSessionDataData.success) {
        return { status: "SUCCESS", message: "Sessão do WhatsApp deletada com sucesso" };
    } else {
        return { status: "ERROR", message: "Erro ao deletar sessão do WhatsApp" };
    }
}

/**
 * Função para iniciar uma nova sessão do WhatsApp
 * @param {string} sessionId - ID da sessão a ser iniciada
 * @param {string} sessionToken - Token de autenticação (opcional)
 * @returns {Promise<Object>} - Dados da sessão iniciada
 */
async function startSession(sessionId, sessionToken) {
    let token = sessionToken; // Usa o token fornecido

    // Se não há token, gera um novo
    if (sessionToken === "" || !sessionToken || sessionToken === null) {
        const generateSessionToken = await fetch(`${API_URL}/api/${sessionId}/${API_KEY}/generate-token`, {method: 'POST'});
        const sessionTokenData = await generateSessionToken.json();
        token = sessionTokenData.token // Usa o token gerado
    }

    // Cabeçalhos da requisição
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    // Inicia a sessão do WhatsApp
    const startingSession = await fetch(`${API_URL}/api/${sessionId}/start-session`, {
        method: 'POST', // Método POST
        body: JSON.stringify({ // Corpo da requisição
            "webhook": "", // URL do webhook (vazia)
            "waitQrCode": false // Não aguarda QR code
        }),
        headers // Cabeçalhos de autorização
    });

    const sessionStartData = await startingSession.json(); // Converte resposta para JSON
        
    // Retorna dados da sessão iniciada
    return {
        message: 'success', // Mensagem de sucesso
        token: token, // Token da sessão
        qr: sessionStartData.qrcode, // Código QR para autenticação
        urlCode: sessionStartData.urlcode // URL do código QR
    };
}

/**
 * Função para verificar o status de uma sessão do WhatsApp
 * @param {string} sessionId - ID da sessão
 * @param {string} sessionToken - Token de autenticação
 * @returns {Promise<Object>} - Status da sessão
 */
async function getSessionStatus(sessionId, sessionToken) {
    // Cabeçalhos da requisição
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Função interna para verificar status
    const checkStatus = async () => {
        const response = await fetch(`${API_URL}/api/${sessionId}/status-session`, { headers });
        const data = await response.json();
        return data;
    };

    let attempts = 0; // Contador de tentativas
    let data = await checkStatus(); // Primeira verificação
    
    // Loop para tentar novamente se a sessão estiver fechada
    while (data.status === "CLOSED" && attempts < 2) {
        attempts++; // Incrementa contador
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
        data = await checkStatus(); // Verifica novamente
    }

    return { status: data.status }; // Retorna o status final
}

/**
 * Função para obter o ID do chat/telefone da sessão
 * @param {string} sessionId - ID da sessão
 * @param {string} sessionToken - Token de autenticação
 * @returns {Promise<string>} - ID do chat/telefone
 */
async function getChatId(sessionId, sessionToken) {
    // Cabeçalhos da requisição
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Faz requisição para obter número do telefone
    const response = await fetch(`${API_URL}/api/${sessionId}/get-phone-number`, { headers });
    const data = await response.json(); // Converte resposta para JSON
    return data.response; // Retorna o número do telefone
}

// Exporta o objeto com todas as funções do adaptador
export const WhatsappAdapter = {
    sendMessage,     // Função para enviar mensagens
    deleteSession,   // Função para deletar sessões
    startSession,    // Função para iniciar sessões
    getSessionStatus, // Função para verificar status
    getChatId        // Função para obter ID do chat
};