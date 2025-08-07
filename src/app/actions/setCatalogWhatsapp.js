'use server'

import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function setCatalogWhatsapp(sessionId, sessionToken, catalogId = null) {
    const catalogId = catalogId ?? sessionId.split('-')[0];
    const docRef = doc(db, "catalogs", catalogId);
        
    await updateDoc(docRef, {
        whatsapp_session: sessionId,
        whatsapp_session_token: sessionToken
    });

    return {message: "catalog-session-vinculated"};
}