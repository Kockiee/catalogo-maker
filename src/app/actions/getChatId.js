export async function getChatId(waSessionId) {
    const waSession = await fetch(`${process.env.WHATSAPP_API_URL}/client/getClassInfo/${waSessionId}`, {
        headers: {
            'x-api-key': process.env.WHATSAPP_API_KEY
        }
    });
    const waSessionData = await waSession.json();
    const chatId = waSessionData.sessionInfo.me._serialized;
    return chatId;
}