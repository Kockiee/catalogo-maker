'use server'

import { db } from "../utils/firebase";
import { deleteDoc, collection, doc, getDocs, query, where } from "firebase/firestore";

export async function deleteCatalogs(catalogs) {
    for (const catalog of catalogs) {
        const q = query(collection(db, "products"), where("catalog", "==", catalog.id));
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
            await deleteDoc(doc.ref);
        }
        await deleteDoc(doc(db, "catalogs", catalog.id));
    }
}