'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function startWhatsappSession(sessionId, sessionToken) { // sessionToken só será diferente de null se for uma sessão já existente
    return await WhatsappAdapter.startSession(sessionId, sessionToken);
}