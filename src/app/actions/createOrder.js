'use server'

import { db } from "../utils/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function createOrder(prevState, formData, catalogId, catalogName, storeName, catalogOwner, order, orderPrice) {
    const buyerPhone = formData.get('buyerPhone');
    const buyerName = formData.get('buyerName');

    if (buyerPhone && buyerName) {
        const colRef = collection(db, 'orders');
        await addDoc(colRef, {
            catalog_id: catalogId,
            catalog_name: catalogName,
            catalog_owner: catalogOwner,
            store_name: storeName,
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            content: order,
            price: orderPrice,
            status: 'waiting-accept',
            created_at: new Date()
        });

        return {message: 'order-created'};
    } else {
        return {message: "invalid-params"};
    }
}