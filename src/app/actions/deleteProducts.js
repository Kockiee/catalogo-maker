'use server'

import { db } from "../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export async function deleteProducts(products) {
    for (const productId of products) {
        const docRef = doc(db, "products", productId);
        await deleteDoc(docRef);
    }
}