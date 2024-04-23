export async function getChatId(waSessionId) {
    const waSession = await fetch(`https://flashy-powder-production.up.railway.app/client/getClassInfo/${waSessionId}`, {
        headers: {
            'x-api-key': process.env.WHATSAPP_API_KEY
        }
    });
    const waSessionData = await waSession.json();
    const chatId = waSessionData.sessionInfo.me._serialized;
    return chatId;
}