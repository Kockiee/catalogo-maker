'use server'

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../utils/firebase";
import { collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore";

export async function updateProduct(prevState, formData, catalogId, productId, variants) {
    const imagesToCreate = formData.getAll('imagesToCreate');
    const imagesToDelete = formData.getAll('imagesToDelete');
    const name = formData.get('name');
    const price = parseFloat(formData.get('price'));
    const description = formData.get('description');
    const soldInCatalog = formData.get('soldInCatalog') || false;

    if (name && description && price && imagesToDelete && imagesToCreate) {
        const colRef = collection(db, "products");
        const q = query(colRef, where("name", "==", name), where("id", "!=", productId), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return {message: "product-already-exists"};
        }

        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        var productImages = docSnap.data().images

        await updateDoc(docRef, {
            name: name,
            price: price,
            description: description,
            variants: variants,
            sold_in_catalog: soldInCatalog
        });
        
        if (imagesToDelete.length > 0) {
            for (const imageUrl of imagesToDelete) {
                productImages = productImages.filter(image => image !== imageUrl);
                const fileRef = ref(storage, imageUrl);
                await deleteObject(fileRef);
            }
        }

        if (imagesToCreate.length > 0) {
            for (const image of imagesToCreate) {
                const storageRef = ref(storage, `${docSnap.owner}/products-images/${image.name}`);
                await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                productImages.push(url);
            }
        }

        await updateDoc(docRef, {
            images: productImages
        });

        return {message: "product-updated"};
    } else {
        return {message: "invalid-params"};
    }
}