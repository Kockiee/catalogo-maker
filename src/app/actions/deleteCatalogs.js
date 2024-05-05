'use server'

import { db } from "../utils/firebase";
import { deleteDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
import { deleteWhatsappSession } from "./deleteWhatsappSession";
import { deleteStorageDirectory } from "./deleteStorageDirectory";

export async function deleteCatalogs(catalogs, userId) {
    console.log(catalogs)
    for (const catalog of catalogs) {
        const catalogId = catalog.id
        
        await deleteStorageDirectory(`${userId}/${catalogId}`);

        const q = query(collection(db, "products"), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref);
            }
        }
        if(catalog.whatsapp_session) await deleteWhatsappSession(catalog.whatsapp_session);
        await deleteDoc(doc(db, "catalogs", catalogId));
        
    }
}