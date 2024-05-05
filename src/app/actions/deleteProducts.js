'use server'

import { db } from "../utils/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteStorageDirectory } from "./deleteStorageDirectory";

export async function deleteProducts(products) {
    for (const productId of products) {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        
        await deleteDoc(docRef);
        
        await deleteStorageDirectory(`${docSnap.data().owner}/${docSnap.data().catalog}/products/${productId}`);
    }
}