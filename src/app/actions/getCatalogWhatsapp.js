'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function getCatalogWhatsapp(sessionId, sessionToken) {
    return await WhatsappAdapter.getSessionStatus(sessionId, sessionToken);
}