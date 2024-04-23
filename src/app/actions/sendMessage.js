'use server'

export async function sendMessage(waSessionId, chatId, message) {
    const response = await fetch(`https://flashy-powder-production.up.railway.app/client/sendMessage/${waSessionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.WHATSAPP_API_KEY
        },
        body: JSON.stringify({
            "chatId": chatId,
            "contentType": "string",
            "content": message
        })
    });

    return response
}
