// lib/whatsappAdapter.js

const API_URL = process.env.WHATSAPP_API_URL;
const API_KEY = process.env.WHATSAPP_API_KEY;

async function sendMessage(sessionId, sessionToken, chatId, message) {
    return fetch(`${API_URL}/api/${sessionId}/send-message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
            number: chatId,
            options: { delay: 1000, presence: 'composing' },
            textMessage: { text: message }
        })
    });
}

async function deleteSession(sessionId, sessionToken) {
    const url = `${API_URL}/api/${sessionId}/logout`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
    };

    const response = await fetch(url, {
        method: 'POST',
        headers
    });

    const data = await response.json();
    return { message: data.response === 'Session closed' ? 'session_terminated' : data.message || data.response };
}

async function createSession(sessionId) {
    const generateSessionToken = await fetch(`${API_URL}/api/${sessionId}/${API_KEY}/generate-token`);
    const sessionTokenData = await generateSessionToken.json();
    
    // if(sessionTokenData.status !== 'success') {
    //     return {
    //         status: 'error_when_generating_session_token',
    //         qr: null,
    //         urlCode: null
    //     };
    // }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': generateSessionToken.token
    };

    const startingSession = await fetch(`${API_URL}/api/${sessionId}/start-session`, {
        method: 'POST',
        headers
    });

    const sessionStartData = await startingSession.json();
        
    return {
        message: 'success',
        token: sessionTokenData.token,
        qr: sessionStartData.qrcode,
        urlCode: sessionStartData.urlcode
    };
}

async function getSessionStatus(sessionId, sessionToken) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionToken
    };

    const url = `${API_URL}/api/${sessionId}/status-session`;

    const response = await fetch(url, { headers });
    const data = await response.json();

    return { message: data.status || data.message };
}

async function getChatId(sessionId, sessionToken) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionToken
    };

    const response = await fetch(`${API_URL}/api/${sessionId}/getHostDevice`, { headers });
    const data = await response.json();
    return data?.wid?._serialized || data?.wid || null;
}


export const WhatsappAdapter = {
    sendMessage,
    deleteSession,
    createSession,
    getSessionStatus,
    getChatId
};