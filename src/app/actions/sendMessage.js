'use server'

import { WhatsappAdapter } from "../lib/WhatsappAdapter";

export async function sendMessage(waSessionId, chatId, message) {
    return await WhatsappAdapter.sendMessage(waSessionId, chatId, message);
}
