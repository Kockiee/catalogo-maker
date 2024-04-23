'use server'

export async function createWhatsappSession(sessionId) {
    const session = async() => {return await fetch(`https://flashy-powder-production.up.railway.app/session/qr/${sessionId}`, {
        headers: {'Content-Type': 'application/json', 'x-api-key': process.env.WHATSAPP_API_KEY}
    }).then(response => response.json())};

    const sessionExistent = await session();

    if (sessionExistent.message === "session_not_found") {
        await fetch(`https://flashy-powder-production.up.railway.app/session/start/${sessionId}`, {
            headers: {'Content-Type': 'application/json', 'x-api-key': process.env.WHATSAPP_API_KEY}
        });

        return await session();
    } else {
        return sessionExistent;
    }
}