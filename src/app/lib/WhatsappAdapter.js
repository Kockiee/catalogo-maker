// lib/whatsappAdapter.js

const API_URL = process.env.WHATSAPP_API_URL;
const API_KEY = process.env.WHATSAPP_API_KEY;

async function sendMessage(sessionId, sessionToken, chatId, message) {
    const sendRequest = async () => {
        const response = await fetch(`${API_URL}/api/${sessionId}/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify({
                phone: chatId,
                isGroup: false,
                isNewsletter: false,
                isLid: false,
                message: message
            })
        });
        const data = await response.json();
        return { response, data };
    };

    let attempts = 0;
    let { response, data } = await sendRequest();
    
    while (data.status === "Disconnected" && attempts < 2) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
        ({ response, data } = await sendRequest());
    }

    return response; 
}

async function deleteSession(sessionId, sessionToken) {
    const closeSessionUrl = `${API_URL}/api/${sessionId}/close-session`;
    const clearSessionDataUrl = `${API_URL}/api/${sessionId}/${API_KEY}/clear-session-data`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    // Fecha a sessão
    const closeSessionResponse = await fetch(closeSessionUrl, {
        method: 'POST',
        headers
    });
    const closeSessionData = await closeSessionResponse.json();

    // Limpa os dados da sessão
    const clearSessionDataResponse = await fetch(clearSessionDataUrl, {
        method: 'POST',
        headers
    });
    const clearSessionDataData = await clearSessionDataResponse.json();


    if (closeSessionData.status && clearSessionDataData.success) {
        return { status: "SUCCESS", message: "Sessão do WhatsApp deletada com sucesso" };
    } else {
        return { status: "ERROR", message: "Erro ao deletar sessão do WhatsApp" };
    }
}

async function startSession(sessionId, sessionToken) {
    let token = sessionToken;

    if (sessionToken === "" || !sessionToken || sessionToken === null) {
        const generateSessionToken = await fetch(`${API_URL}/api/${sessionId}/${API_KEY}/generate-token`, {method: 'POST'});
        const sessionTokenData = await generateSessionToken.json();
        token = sessionTokenData.token
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    

    const startingSession = await fetch(`${API_URL}/api/${sessionId}/start-session`, {
        method: 'POST',
        body: JSON.stringify({
            "webhook": "",
            "waitQrCode": false
        }),
        headers
    });

    const sessionStartData = await startingSession.json();
        
    return {
        message: 'success',
        token: token,
        qr: sessionStartData.qrcode,
        urlCode: sessionStartData.urlcode
    };
}

async function getSessionStatus(sessionId, sessionToken) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    const checkStatus = async () => {
        const response = await fetch(`${API_URL}/api/${sessionId}/status-session`, { headers });
        const data = await response.json();
        return data;
    };

    let attempts = 0;
    let data = await checkStatus();
    
    while (data.status === "CLOSED" && attempts < 2) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        data = await checkStatus();
    }

    return { status: data.status };
}

async function getChatId(sessionId, sessionToken) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    const response = await fetch(`${API_URL}/api/${sessionId}/get-phone-number`, { headers });
    const data = await response.json();
    return data.response;
}


export const WhatsappAdapter = {
    sendMessage,
    deleteSession,
    startSession,
    getSessionStatus,
    getChatId
};