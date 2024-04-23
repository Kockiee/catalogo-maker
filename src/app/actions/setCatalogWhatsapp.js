'use server'

import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function setCatalogWhatsapp(sessionId, catalogId) {
    const docRef = doc(db, "catalogs", catalogId);
        
    await updateDoc(docRef, {
        whatsapp_session: sessionId,
    });

    return {message: "catalog-session-vinculated"};
}