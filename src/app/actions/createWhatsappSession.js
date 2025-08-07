'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function createWhatsappSession(sessionId) {
    return await WhatsappAdapter.createSession(sessionId);
}