'use server'

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../utils/firebase";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export async function createProduct(prevState, formData, catalogId, uid, variants) {
    const images = formData.getAll('images');
    const name = formData.get('name');
    const price = parseFloat(formData.get('price'));
    const description = formData.get('description');
    const soldInCatalog = formData.get('soldInCatalog');

    if (name && description && price && uid && images) {
        const colRef = collection(db, "products");
        const q = query(colRef, where("name", "==", name), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return {message: "product-already-exists"};
        }
        
        const newProduct = await addDoc(colRef, {
            owner: uid,
            name: name,
            catalog: catalogId,
            description: description,
            price: price,
            variations: variants,
            sold_in_catalog: soldInCatalog,
            created_at: new Date()
        });

        if (newProduct) {
            const productImages = [];
            for (const image of images) {
                const storageRef = ref(storage, `${uid}/products-images/${image.name}`);
                await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                productImages.push(url);
            }

            const docRef = doc(db, "products", newProduct.id);
            await updateDoc(docRef, {
                images: productImages
            });
        }

        return {message: "product-created"};
    } else {
        return {message: "invalid-params"};
    }
}