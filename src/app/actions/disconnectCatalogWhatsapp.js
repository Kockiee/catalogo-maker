'use server'

import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { deleteWhatsappSession } from "./deleteWhatsappSession";

export async function disconnectCatalogWhatsapp(catalogId, whatsappSession, whatsappSessionToken) {
    try {
        // Deletar a sessão do WhatsApp
        if (whatsappSession) {
            const deleteWhatsappSessionData = await deleteWhatsappSession(whatsappSession, whatsappSessionToken);
            if (deleteWhatsappSessionData.status === "ERROR") {
                return { success: false, message: "Erro ao deletar sessão do WhatsApp" };
            }
        }

        // Atualizar o catálogo removendo a sessão do WhatsApp
        const catalogRef = doc(db, "catalogs", catalogId);
        await updateDoc(catalogRef, {
            whatsapp_session: null,
            whatsapp_session_token: null
        });

        return { success: true, message: "Sessão do WhatsApp desconectada com sucesso!" };
    } catch (error) {
        console.error("Erro ao desconectar sessão do WhatsApp:", error);
        return { success: false, message: "Erro ao desconectar sessão do WhatsApp" };
    }
}
