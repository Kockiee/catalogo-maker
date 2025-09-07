'use server'

import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function setCatalogWhatsapp(sessionId, sessionToken, catalogId = null) {
    const catalog = catalogId ?? sessionId.split('-')[0];
    const docRef = doc(db, "catalogs", catalog);
        
    await updateDoc(docRef, {
        whatsapp_session: sessionId,
        whatsapp_session_token: sessionToken
    });

    return {message: "catalog-session-vinculated"};
}