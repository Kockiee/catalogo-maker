'use server'

import { db } from "../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export async function refuseOrder(orderId) {
    const docRef = doc(db, "orders", orderId);
    await deleteDoc(docRef)
}