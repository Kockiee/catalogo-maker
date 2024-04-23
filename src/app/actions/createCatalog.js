'use server'

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../utils/firebase";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

export async function createCatalog(prevState, formData, userId) {
    const uid = userId;
    const name = formData.get('identificationName');
    const store_name = formData.get('storeName');
    const store_description = formData.get('storeDescription');
    const primary_color = formData.get('primaryColor');
    const secondary_color = formData.get('secondaryColor');
    const tertiary_color = formData.get('tertiaryColor');
    const text_color = formData.get('textColor');

    if (uid && name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        const colRef = collection(db, "catalogs");
        const q = query(colRef, where("name", "==", name), where("store_name", "==", store_name), where("owner", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return {message: "catalog-already-exists"};
        }
        
        const newCatalog = await addDoc(colRef, {
            owner: uid,
            name: name,
            store_name: store_name,
            store_description: store_description,
            primary_color: primary_color,
            secondary_color: secondary_color,
            tertiary_color: tertiary_color,
            text_color: text_color,
            created_at: new Date()
        });

        if (newCatalog) {
            const bannerImage = formData.get('bannerImage')
            if (bannerImage) {
                const storageRef = ref(storage, `${uid}/catalog-banner`);
                await uploadBytes(storageRef, bannerImage);
                await getDownloadURL(storageRef).then(async(url) => {
                    const docRef = doc(db, "catalogs", newCatalog.id);
                    await updateDoc(docRef, {
                      banner_url: url
                    });
                });
            }
        }

        return {message: "catalog-created"};
    } else {
        return {message: "invalid-params"};
    }
}