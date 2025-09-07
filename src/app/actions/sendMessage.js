'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function sendMessage(waSessionId, waSessionToken, chatId, message) {
    return await WhatsappAdapter.sendMessage(waSessionId, waSessionToken, chatId, message);
}
