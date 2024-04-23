'use server'

export async function getCatalogWhatsapp(sessionId) {
    const response = await fetch(`https://flashy-powder-production.up.railway.app/session/status/${sessionId}`, {
        headers: {'Content-Type': 'application/json', 'x-api-key': process.env.WHATSAPP_API_KEY}
    });
    const data = await response.json();

    return data;
}