'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function getChatId(waSessionId) {
    return await WhatsappAdapter.getChatId(waSessionId);
}