'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function deleteWhatsappSession(sessionId) {
    return await WhatsappAdapter.deleteSession(sessionId);
}