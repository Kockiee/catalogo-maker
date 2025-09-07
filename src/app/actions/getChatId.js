'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function getChatId(waSessionId, waSessionToken) {
    return await WhatsappAdapter.getChatId(waSessionId, waSessionToken);
}