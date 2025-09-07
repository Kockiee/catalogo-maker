'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function getCatalogWhatsappStatus(sessionId, sessionToken) {
    return await WhatsappAdapter.getSessionStatus(sessionId, sessionToken);
}