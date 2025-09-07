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

async function createSession(sessionId, sessionToken) {
    let token = sessionToken;
    console.log("createSession called with sessionId:", sessionId, "and sessionToken:", sessionToken);

    if (sessionToken === "" || !sessionToken || sessionToken === null) {
        const generateSessionToken = await fetch(`${API_URL}/api/${sessionId}/${API_KEY}/generate-token`, {method: 'POST'});
        const sessionTokenData = await generateSessionToken.json();
        token = sessionTokenData.token
        console.log("Generated new session token:", token);
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
        console.log("getSessionStatus:\n", data)
        return data;
    };

    let attempts = 0;
    let data = await checkStatus();
    
    while (data.status === "CLOSED" && attempts < 2) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
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
    console.log("getChatId:\n" + data)
    return data.response;
}


export const WhatsappAdapter = {
    sendMessage,
    deleteSession,
    createSession,
    getSessionStatus,
    getChatId
};