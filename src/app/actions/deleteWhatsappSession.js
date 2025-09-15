'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function deleteWhatsappSession(sessionId, sessionToken) {
    return await WhatsappAdapter.deleteSession(sessionId, sessionToken);
}