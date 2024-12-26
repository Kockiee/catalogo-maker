'use server'
export async function deleteWhatsappSession(waSession) {
    const response = await fetch(`${process.env.WHATSAPP_API_URL}/session/terminate/${waSession}`, {
        headers: {
            'Content-Type': 'application/json', 
            'x-api-key': process.env.WHATSAPP_API_KEY
        }
    });
    const data = await response.json();
    return data;
}