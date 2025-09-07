'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function createWhatsappSession(sessionId, sessionToken) { // sessionToken só será diferente de null se for uma sessão já existente
    return await WhatsappAdapter.createSession(sessionId, sessionToken);
}